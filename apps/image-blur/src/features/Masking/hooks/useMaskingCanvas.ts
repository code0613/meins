import { useCallback, useEffect, useRef, useState } from 'react';

import { track } from '@vercel/analytics/react';

import { MAX_HISTORY } from '../constants';
import { useBrushThickness, useIntensity, useMaskMode, useMaskShape } from '../store';
import {
  buildDownloadName,
  composeStroke,
  createEffectCanvas,
  downloadCanvas,
  scaleThickness,
  toImagePoint,
} from '../utils/canvas';

import type { LoadedImage, Point, Stroke } from '../types';

interface UseMaskingCanvasParams {
  image: LoadedImage | null;
}

function createOffscreen(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function useMaskingCanvas({ image }: UseMaskingCanvasParams) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** 되돌리기 범위 밖으로 밀려난 스트로크까지 구워 넣은 판 */
  const bakedRef = useRef<HTMLCanvasElement | null>(null);
  /** baked + 되돌릴 수 있는 스트로크. 드래그 중 이것만 복사해 쓴다 */
  const baseRef = useRef<HTMLCanvasElement | null>(null);

  const strokesRef = useRef<Stroke[]>([]);
  const draftRef = useRef<Stroke | null>(null);
  const rafRef = useRef<number | null>(null);
  const effectCacheRef = useRef(new Map<string, HTMLCanvasElement>());

  const [strokeCount, setStrokeCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const mode = useMaskMode();
  const shape = useMaskShape();
  const intensity = useIntensity();
  const brushThickness = useBrushThickness();

  const getEffectCanvas = useCallback(
    (target: LoadedImage, strokeMode: Stroke['mode'], strokeIntensity: number) => {
      const key = `${strokeMode}:${strokeIntensity}`;
      const cached = effectCacheRef.current.get(key);
      if (cached) {
        return cached;
      }

      const created = createEffectCanvas(target, strokeMode, strokeIntensity);
      effectCacheRef.current.set(key, created);
      return created;
    },
    [],
  );

  const rebuildBase = useCallback(() => {
    const base = baseRef.current;
    const baked = bakedRef.current;
    if (!image || !base || !baked) {
      return;
    }

    const ctx = base.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, base.width, base.height);
    ctx.drawImage(baked, 0, 0);

    strokesRef.current.forEach(stroke => {
      composeStroke(ctx, getEffectCanvas(image, stroke.mode, stroke.intensity), stroke, base.width, base.height);
    });
  }, [getEffectCanvas, image]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const base = baseRef.current;
    if (!image || !canvas || !base) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);

    const draft = draftRef.current;
    if (draft) {
      composeStroke(ctx, getEffectCanvas(image, draft.mode, draft.intensity), draft, canvas.width, canvas.height);
    }
  }, [getEffectCanvas, image]);

  const schedulePaint = useCallback(() => {
    if (rafRef.current !== null) {
      return;
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      paint();
    });
  }, [paint]);

  useEffect(() => {
    strokesRef.current = [];
    draftRef.current = null;
    effectCacheRef.current.clear();
    setStrokeCount(0);

    if (!image) {
      bakedRef.current = null;
      baseRef.current = null;
      return;
    }

    const baked = createOffscreen(image.width, image.height);
    baked.getContext('2d')?.drawImage(image.element, 0, 0);
    bakedRef.current = baked;

    baseRef.current = createOffscreen(image.width, image.height);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = image.width;
      canvas.height = image.height;
    }

    rebuildBase();
    paint();
  }, [image, paint, rebuildBase]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    },
    [],
  );

  const buildDraft = useCallback(
    (point: Point): Stroke => {
      if (shape === 'rect') {
        return { shape: 'rect', mode, intensity, start: point, end: point };
      }
      return {
        shape: 'pen',
        mode,
        intensity,
        thickness: scaleThickness(brushThickness, image?.width ?? 1000),
        points: [point],
      };
    },
    [brushThickness, image?.width, intensity, mode, shape],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!image || !canvas) {
        return;
      }

      canvas.setPointerCapture(event.pointerId);
      draftRef.current = buildDraft(toImagePoint(canvas, event.clientX, event.clientY));
      setIsDrawing(true);
      schedulePaint();
    },
    [buildDraft, image, schedulePaint],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const draft = draftRef.current;
      if (!canvas || !draft) {
        return;
      }

      const point = toImagePoint(canvas, event.clientX, event.clientY);

      if (draft.shape === 'rect') {
        draftRef.current = { ...draft, end: point };
      } else {
        draftRef.current = { ...draft, points: [...draft.points, point] };
      }

      schedulePaint();
    },
    [schedulePaint],
  );

  const commitDraft = useCallback(() => {
    const draft = draftRef.current;
    if (!draft) {
      return;
    }

    draftRef.current = null;
    setIsDrawing(false);

    // 점만 찍고 끝난 사각형은 넓이가 없어 의미가 없다
    if (draft.shape === 'rect' && (draft.start.x === draft.end.x || draft.start.y === draft.end.y)) {
      paint();
      return;
    }

    const next = [...strokesRef.current, draft];

    // 되돌리기 범위를 넘어선 스트로크는 baked에 구워 넣어 화면에서 사라지지 않게 한다
    while (next.length > MAX_HISTORY) {
      const oldest = next.shift();
      const baked = bakedRef.current;
      const bakedCtx = baked?.getContext('2d');
      if (oldest && image && baked && bakedCtx) {
        composeStroke(bakedCtx, getEffectCanvas(image, oldest.mode, oldest.intensity), oldest, baked.width, baked.height);
      }
    }

    strokesRef.current = next;
    setStrokeCount(next.length);

    rebuildBase();
    paint();
  }, [getEffectCanvas, image, paint, rebuildBase]);

  const undo = useCallback(() => {
    if (strokesRef.current.length === 0) {
      return;
    }

    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    rebuildBase();
    paint();
  }, [paint, rebuildBase]);

  const reset = useCallback(() => {
    if (!image) {
      return;
    }

    strokesRef.current = [];
    draftRef.current = null;
    setStrokeCount(0);

    const baked = bakedRef.current;
    const bakedCtx = baked?.getContext('2d');
    if (baked && bakedCtx) {
      bakedCtx.clearRect(0, 0, baked.width, baked.height);
      bakedCtx.drawImage(image.element, 0, 0);
    }

    rebuildBase();
    paint();
  }, [image, paint, rebuildBase]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!image || !canvas) {
      return;
    }
    downloadCanvas(canvas, buildDownloadName(image.baseName, image.mimeType), image.mimeType);
    track('save_image');
  }, [image]);

  return {
    canvasRef,
    strokeCount,
    isDrawing,
    canUndo: strokeCount > 0,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: commitDraft,
    undo,
    reset,
    download,
  };
}
