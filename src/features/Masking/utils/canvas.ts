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

let filterBlurWorks: boolean | null = null;

/**
 * `ctx.filter` 는 속성이 있어도 무시하는 구현이 있다. Safari와 일부 인앱 WebView가 그렇고,
 * 그대로 두면 블러가 조용히 원본을 그려 가려진 줄 알고 저장하게 된다.
 * 존재 여부가 아니라 경계 픽셀이 실제로 섞였는지로 판정한다.
 */
function supportsFilterBlur() {
  if (filterBlurWorks !== null) {
    return filterBlurWorks;
  }

  try {
    const probe = createCanvas(8, 8);
    const ctx = getContext(probe);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 8, 8);
    ctx.filter = 'blur(2px)';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 4, 8);
    ctx.filter = 'none';

    const [red] = ctx.getImageData(4, 4, 1, 1).data;
    filterBlurWorks = red > 8 && red < 247;
  } catch {
    filterBlurWorks = false;
  }

  return filterBlurWorks;
}

function createFilterBlurCanvas(image: HTMLImageElement, width: number, height: number, radius: number) {
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

/**
 * 작게 줄였다 늘리면 보간이 픽셀을 섞는다. 필터 없이도 어디서나 동작한다.
 * 같은 반지름이면 filter 쪽이 더 강하게 뭉개므로 축소 비율을 키워 세기를 맞춘다.
 * 덜 뭉개지는 것보다 더 뭉개지는 쪽이 안전하다.
 */
const DOWNSCALE_STRENGTH = 1.7;

function createDownscaleBlurCanvas(image: HTMLImageElement, width: number, height: number, radius: number) {
  const divisor = radius * DOWNSCALE_STRENGTH;
  const smallWidth = Math.max(1, Math.round(width / divisor));
  const smallHeight = Math.max(1, Math.round(height / divisor));

  const small = createCanvas(smallWidth, smallHeight);
  const smallCtx = getContext(small);
  smallCtx.imageSmoothingEnabled = true;
  smallCtx.imageSmoothingQuality = 'high';
  smallCtx.drawImage(image, 0, 0, width, height, 0, 0, smallWidth, smallHeight);

  const canvas = createCanvas(width, height);
  const ctx = getContext(canvas);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(small, 0, 0, smallWidth, smallHeight, 0, 0, width, height);
  return canvas;
}

function createBlurCanvas(image: HTMLImageElement, width: number, height: number, radius: number) {
  if (supportsFilterBlur()) {
    return createFilterBlurCanvas(image, width, height, radius);
  }
  return createDownscaleBlurCanvas(image, width, height, radius);
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

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('CANVAS_BLOB_FAILED'));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

/**
 * OS 공유 시트를 연다. 네트워크로 보내는 것이 아니라 어디로 보낼지 사용자가 그 자리에서 고른다.
 * iOS에서는 「이미지 저장」이 이 시트 안에 있고, 인앱 브라우저에서도 대부분 동작한다.
 */
async function shareFile(file: File) {
  if (!navigator.canShare || !navigator.share || !navigator.canShare({ files: [file] })) {
    return false;
  }

  try {
    await navigator.share({ files: [file] });
    return true;
  } catch (error) {
    // 사용자가 시트를 닫은 것은 실패가 아니다. 다운로드로 또 떨어지면 안 된다
    return error instanceof DOMException && error.name === 'AbortError';
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 즉시 해제하면 다운로드가 시작되기 전에 URL이 죽는 브라우저가 있다
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * 인앱 브라우저는 `<a download>`를 무시하는 경우가 많다. 되는 방법을 순서대로 시도한다.
 * UA로 브라우저를 판별하지 않는다. 앱마다 형식이 다르고 계속 바뀐다.
 */
export async function saveCanvas(canvas: HTMLCanvasElement, fileName: string, mimeType: string) {
  const type = mimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
  const quality = type === 'image/jpeg' ? 0.95 : undefined;

  const blob = await canvasToBlob(canvas, type, quality);
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (isTouchDevice && (await shareFile(new File([blob], fileName, { type })))) {
    return;
  }

  downloadBlob(blob, fileName);
}

export function buildDownloadName(baseName: string, mimeType: string) {
  const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png';
  return `secure_masked_${baseName}.${extension}`;
}
