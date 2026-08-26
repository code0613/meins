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

function createBlurCanvas(image: HTMLImageElement, width: number, height: number, radius: number) {
  const padding = Math.ceil(radius * 2);
  const padded = createCanvas(width + padding * 2, height + padding * 2);
  const paddedCtx = getContext(padded);

  // 여백 없이 그리면 블러가 캔버스 밖 투명색을 빨아들여 테두리가 흐려진다
  paddedCtx.drawImage(image, 0, 0, width, height, 0, 0, padded.width, padded.height);
  paddedCtx.filter = `blur(${radius}px)`;
  paddedCtx.drawImage(image, 0, 0, width, height, padding, padding, width, height);
  paddedCtx.filter = 'none';

  const canvas = createCanvas(width, height);
  getContext(canvas).drawImage(padded, padding, padding, width, height, 0, 0, width, height);
  return canvas;
}

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

export function toImagePoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

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
