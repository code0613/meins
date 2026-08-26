/** 가리는 방식. fill은 원본과 무관한 단색으로 덮어 복원을 불가능하게 한다 */
export type MaskMode = 'mosaic' | 'blur' | 'fill';

/** 강도 조절이 의미 있는 방식. 채우기는 세기 개념이 없다 */
export type AdjustableMaskMode = Exclude<MaskMode, 'fill'>;

/** 마우스로 그리는 형태 */
export type MaskShape = 'pen' | 'rect';

export type BrushSize = 'small' | 'medium' | 'large';

export interface Point {
  x: number;
  y: number;
}

interface StrokeBase {
  mode: MaskMode;
  /** 모자이크면 블록 크기(px), 블러면 반경(px). 채우기는 쓰지 않아 0. 원본 해상도 기준 */
  intensity: number;
}

export interface PenStroke extends StrokeBase {
  shape: 'pen';
  /** 선 굵기(px). 원본 해상도 기준 */
  thickness: number;
  points: Point[];
}

export interface RectStroke extends StrokeBase {
  shape: 'rect';
  start: Point;
  end: Point;
}

export type Stroke = PenStroke | RectStroke;

export interface LoadedImage {
  element: HTMLImageElement;
  width: number;
  height: number;
  /** 확장자를 뺀 원본 파일명 */
  baseName: string;
  mimeType: string;
}
