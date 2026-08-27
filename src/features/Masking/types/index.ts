export type MaskMode = 'mosaic' | 'blur' | 'fill';

export type AdjustableMaskMode = Exclude<MaskMode, 'fill'>;

export type MaskShape = 'pen' | 'rect';

export type BrushSize = 'small' | 'medium' | 'large';

export interface Point {
  x: number;
  y: number;
}

interface StrokeBase {
  mode: MaskMode;
  intensity: number;
}

export interface PenStroke extends StrokeBase {
  shape: 'pen';
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
  baseName: string;
  mimeType: string;
}
