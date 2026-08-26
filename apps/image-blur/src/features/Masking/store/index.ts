import { create } from 'zustand';

import { BRUSH_THICKNESS, INTENSITY_RANGE, isAdjustableMode } from '../constants';

import type { AdjustableMaskMode, BrushSize, MaskMode, MaskShape } from '../types';

interface ToolState {
  mode: MaskMode;
  shape: MaskShape;
  brushSize: BrushSize;
  /** 모드마다 적정 범위가 달라 값을 따로 들고 있는다 */
  intensityByMode: Record<AdjustableMaskMode, number>;
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
      if (!isAdjustableMode(mode)) {
        return;
      }
      set({ intensityByMode: { ...intensityByMode, [mode]: intensity } });
    },
  },
}));

export const useMaskMode = () => useToolStore(state => state.mode);
export const useMaskShape = () => useToolStore(state => state.shape);
export const useBrushSize = () => useToolStore(state => state.brushSize);
/** 채우기는 세기가 없어 0을 돌려준다. 효과판 캐시 키로만 쓰인다 */
export const useIntensity = () =>
  useToolStore(state => (isAdjustableMode(state.mode) ? state.intensityByMode[state.mode] : 0));
export const useBrushThickness = () => useToolStore(state => BRUSH_THICKNESS[state.brushSize]);
export const useToolActions = () => useToolStore(state => state.actions);
