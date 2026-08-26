import type { BrushSize, MaskMode } from '../types';

/** 브라우저가 캔버스로 다룰 수 있고 이 앱이 받는 포맷 */
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const ACCEPTED_EXTENSION_TEXT = 'JPG, PNG, WEBP';

/**
 * 브러시 굵기(px). 원본 해상도 기준이라 큰 사진일수록 상대적으로 얇아진다.
 * 그래서 실제 적용 시 이미지 크기에 비례해 보정한다(scaleThickness).
 */
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
};

/** 모드별 강도 슬라이더 범위 */
export const INTENSITY_RANGE: Record<MaskMode, { min: number; max: number; step: number; default: number }> = {
  mosaic: { min: 4, max: 48, step: 2, default: 16 },
  blur: { min: 4, max: 40, step: 2, default: 14 },
};

/** 되돌리기로 보관할 최대 단계 */
export const MAX_HISTORY = 10;

/** 이 크기를 넘으면 브라우저 메모리 부담이 커져 미리 알린다 */
export const LARGE_IMAGE_PIXELS = 40_000_000;
