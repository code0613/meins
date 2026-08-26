import { FILL_COLOR } from '../constants';

import type { LoadedImage, MaskMode, Point, Stroke } from '../types';

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function getContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE');
  }
  return ctx;
}

/**
 * 이미지 전체를 블록 단위 평균색으로 덮어 모자이크판을 만든다.
 * 블록마다 getImageData를 부르면 호출 비용이 커서, 전체를 한 번만 읽고 배열에서 계산한다.
 */
function createMosaicCanvas(image: HTMLImageElement, width: number, height: number, blockSize: number) {
  const canvas = createCanvas(width, height);
  const ctx = getContext(canvas);
  ctx.drawImage(image, 0, 0, width, height);

  const source = ctx.getImageData(0, 0, width, height);
  const { data } = source;

  for (let blockY = 0; blockY < height; blockY += blockSize) {
    for (let blockX = 0; blockX < width; blockX += blockSize) {
      const maxY = Math.min(blockY + blockSize, height);
      const maxX = Math.min(blockX + blockSize, width);

      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let y = blockY; y < maxY; y += 1) {
        for (let x = blockX; x < maxX; x += 1) {
          const index = (y * width + x) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count += 1;
        }
      }

      const avgR = r / count;
      const avgG = g / count;
      const avgB = b / count;

      for (let y = blockY; y < maxY; y += 1) {
        for (let x = blockX; x < maxX; x += 1) {
          const index = (y * width + x) * 4;
          data[index] = avgR;
          data[index + 1] = avgG;
          data[index + 2] = avgB;
        }
      }
    }
  }

  ctx.putImageData(source, 0, 0);
  return canvas;
}

/**
 * 이미지 전체에 블러를 먹인 판을 만든다.
 * 가장자리가 투명하게 번지지 않도록 캔버스를 여유 있게 잡고 그린 뒤 원래 크기로 잘라낸다.
 */
function createBlurCanvas(image: HTMLImageElement, width: number, height: number, radius: number) {
  const padding = Math.ceil(radius * 2);
  const padded = createCanvas(width + padding * 2, height + padding * 2);
  const paddedCtx = getContext(padded);

  // 가장자리 픽셀을 바깥으로 늘려 깔아두면 블러가 투명색을 빨아들이지 않는다
  paddedCtx.drawImage(image, 0, 0, width, height, 0, 0, padded.width, padded.height);
  paddedCtx.filter = `blur(${radius}px)`;
  paddedCtx.drawImage(image, 0, 0, width, height, padding, padding, width, height);
  paddedCtx.filter = 'none';

  const canvas = createCanvas(width, height);
  getContext(canvas).drawImage(padded, padding, padding, width, height, 0, 0, width, height);
  return canvas;
}

/**
 * 원본을 참조하지 않고 단색으로만 채운 판.
 * 모자이크·블러와 달리 원본 픽셀에서 파생된 값이 전혀 남지 않아 복원이 불가능하다.
 */
function createFillCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = getContext(canvas);
  ctx.fillStyle = FILL_COLOR;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

export function createEffectCanvas(
  image: LoadedImage,
  mode: MaskMode,
  intensity: number,
): HTMLCanvasElement {
  if (mode === 'fill') {
    return createFillCanvas(image.width, image.height);
  }
  if (mode === 'mosaic') {
    return createMosaicCanvas(image.element, image.width, image.height, Math.max(2, Math.round(intensity)));
  }
  return createBlurCanvas(image.element, image.width, image.height, Math.max(1, intensity));
}

/** 스트로크가 덮는 영역만 흰색으로 칠한 판. 효과판을 오려낼 틀로 쓴다. */
function createStrokeMaskCanvas(stroke: Stroke, width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = getContext(canvas);
  ctx.fillStyle = '#FFFFFF';

  if (stroke.shape === 'rect') {
    const x = Math.min(stroke.start.x, stroke.end.x);
    const y = Math.min(stroke.start.y, stroke.end.y);
    ctx.fillRect(x, y, Math.abs(stroke.end.x - stroke.start.x), Math.abs(stroke.end.y - stroke.start.y));
    return canvas;
  }

  if (stroke.points.length === 0) {
    return canvas;
  }

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = stroke.thickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 점이 하나뿐이면 선이 그려지지 않으므로 점 하나를 원으로 찍는다
  if (stroke.points.length === 1) {
    const [only] = stroke.points;
    ctx.beginPath();
    ctx.arc(only.x, only.y, stroke.thickness / 2, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  }

  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i += 1) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();

  return canvas;
}

/**
 * 효과판에서 스트로크 영역만 오려 대상 캔버스 위에 얹는다.
 * 원본 픽셀을 직접 뭉개지 않고 덮어쓰기만 하므로, 스트로크 목록만 되돌리면 원본이 그대로 살아난다.
 */
export function composeStroke(
  targetCtx: CanvasRenderingContext2D,
  effectCanvas: HTMLCanvasElement,
  stroke: Stroke,
  width: number,
  height: number,
) {
  const mask = createStrokeMaskCanvas(stroke, width, height);
  const maskCtx = getContext(mask);

  maskCtx.globalCompositeOperation = 'source-in';
  maskCtx.drawImage(effectCanvas, 0, 0);

  targetCtx.drawImage(mask, 0, 0);
}

/**
 * 화면 좌표를 원본 이미지 좌표로 옮긴다.
 * 캔버스는 CSS로 줄여 보여주므로 표시 크기와 실제 픽셀 크기의 비율을 곱해야 한다.
 */
export function toImagePoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

/**
 * 브러시 굵기를 이미지 크기에 맞춰 보정한다.
 * 기준 폭 1000px에서 정해둔 굵기가 4000px 사진에서 실오라기처럼 보이는 걸 막는다.
 */
export function scaleThickness(baseThickness: number, imageWidth: number) {
  const REFERENCE_WIDTH = 1000;
  return Math.max(6, (baseThickness * imageWidth) / REFERENCE_WIDTH);
}

export function downloadCanvas(canvas: HTMLCanvasElement, fileName: string, mimeType: string) {
  const type = mimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
  const quality = type === 'image/jpeg' ? 0.95 : undefined;

  const url = canvas.toDataURL(type, quality);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function buildDownloadName(baseName: string, mimeType: string) {
  const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png';
  return `secure_masked_${baseName}.${extension}`;
}
