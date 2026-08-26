import { create } from 'zustand';

import { BRUSH_THICKNESS, INTENSITY_RANGE } from '../constants';

import type { BrushSize, MaskMode, MaskShape } from '../types';

interface ToolState {
  mode: MaskMode;
  shape: MaskShape;
  brushSize: BrushSize;
  /** 모드마다 적정 범위가 달라 값을 따로 들고 있는다 */
  intensityByMode: Record<MaskMode, number>;
  actions: {
    setMode: (mode: MaskMode) => void;
    setShape: (shape: MaskShape) => void;
    setBrushSize: (brushSize: BrushSize) => void;
    setIntensity: (intensity: number) => void;
  };
}

const useToolStore = create<ToolState>((set, get) => ({
  mode: 'mosaic',
  shape: 'pen',
  brushSize: 'medium',
  intensityByMode: {
    mosaic: INTENSITY_RANGE.mosaic.default,
    blur: INTENSITY_RANGE.blur.default,
  },
  actions: {
    setMode: mode => {
      set({ mode });
    },
    setShape: shape => {
      set({ shape });
    },
    setBrushSize: brushSize => {
      set({ brushSize });
    },
    setIntensity: intensity => {
      const { mode, intensityByMode } = get();
      set({ intensityByMode: { ...intensityByMode, [mode]: intensity } });
    },
  },
}));

export const useMaskMode = () => useToolStore(state => state.mode);
export const useMaskShape = () => useToolStore(state => state.shape);
export const useBrushSize = () => useToolStore(state => state.brushSize);
export const useIntensity = () => useToolStore(state => state.intensityByMode[state.mode]);
export const useBrushThickness = () => useToolStore(state => BRUSH_THICKNESS[state.brushSize]);
export const useToolActions = () => useToolStore(state => state.actions);
