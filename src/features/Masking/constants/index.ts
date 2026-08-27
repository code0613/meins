import type { AdjustableMaskMode, BrushSize, MaskMode } from '../types';

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const ACCEPTED_EXTENSION_TEXT = 'JPG, PNG, WEBP';

export const BRUSH_THICKNESS: Record<BrushSize, number> = {
  small: 24,
  medium: 48,
  large: 88,
};

export const BRUSH_SIZE_LABEL: Record<BrushSize, string> = {
  small: '얇게',
  medium: '보통',
  large: '굵게',
};

export const MASK_MODE_LABEL: Record<MaskMode, string> = {
  mosaic: '모자이크',
  blur: '블러',
  fill: '채우기',
};

export const INTENSITY_RANGE: Record<
  AdjustableMaskMode,
  { min: number; max: number; step: number; default: number }
> = {
  mosaic: { min: 4, max: 48, step: 2, default: 16 },
  blur: { min: 4, max: 40, step: 2, default: 14 },
};

/** 반투명으로 바꾸면 원본이 비쳐 복원 여지가 생긴다. 불투명 단색을 유지할 것 */
export const FILL_COLOR = '#111111';

export function isAdjustableMode(mode: MaskMode): mode is AdjustableMaskMode {
  return mode !== 'fill';
}

export const MAX_HISTORY = 10;

export const LARGE_IMAGE_PIXELS = 40_000_000;

/** 맥은 ⌘, 그 외는 Ctrl. 표기용이라 UA로 갈라도 위험이 없다 */
export const UNDO_SHORTCUT_LABEL =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘Z' : 'Ctrl+Z';
