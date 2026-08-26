/** 가리는 방식 */
export type MaskMode = 'mosaic' | 'blur';

/** 마우스로 그리는 형태 */
export type MaskShape = 'pen' | 'rect';

export type BrushSize = 'small' | 'medium' | 'large';

export interface Point {
  x: number;
  y: number;
}

interface StrokeBase {
  mode: MaskMode;
  /** 모자이크면 블록 크기(px), 블러면 반경(px). 둘 다 원본 해상도 기준 */
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
