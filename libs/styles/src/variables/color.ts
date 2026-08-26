// Main Color
export const PRIMARY = '#6366F1';

/*
 *  NOTICE
 *  디자인 시스템 상 5G, 10G 등과 같이 표시되어있지만 개발 편의상 G를 제거하고 선언
 */
export const INDIGO = {
  5: '#EEF0FF',
  10: '#E0E3FF',
  20: '#C7CBFE',
  30: '#A5ABFC',
  40: '#8B90FA',
  50: '#6366F1', // MAIN
  60: '#5457E0',
  70: '#4649C7',
  80: '#3B3DA3',
  90: '#333582',
  100: '#25264F',
};

export const EMERALD = {
  5: '#ECFDF5',
  10: '#D1FAE5',
  20: '#A7F3D0',
  30: '#6EE7B7',
  40: '#34D399',
  50: '#10B981', // POINT
  60: '#059669',
  70: '#047857',
  80: '#065F46',
  90: '#064E3B',
  100: '#032E22',
};

/** 배경과 표면을 이루는 중립 톤. 값이 클수록 어둡다. */
export const SLATE = {
  5: '#F8FAFC',
  10: '#F1F5F9',
  20: '#E2E8F0',
  30: '#CBD5E1',
  40: '#94A3B8',
  50: '#64748B',
  60: '#475569',
  70: '#334155',
  80: '#1E293B',
  90: '#0F172A', // BACKGROUND
  100: '#020617',
};

export const GREY = {
  5: '#FAFAFA',
  10: '#F4F4F4',
  20: '#ECECEC',
  30: '#DEDEDE',
  40: '#BBBBBB',
  50: '#9B9B9B',
  60: '#727272',
  70: '#5F5F5F',
  80: '#404040',
  90: '#1F1F1F',
};

export const BLACK = '#000000';
export const WHITE = '#FFFFFF';

// Sub Color
export const SUCCESS = EMERALD[50];
export const ERROR = '#F43F5E';
export const WARNING = '#F59E0B';

// Surface
/** 다크 배경 위에 올라가는 카드·패널 표면 */
export const SURFACE = SLATE[80];
export const BACKGROUND = SLATE[90];
export const BORDER = SLATE[70];

// Text
export const TEXT_PRIMARY = SLATE[5];
export const TEXT_SECONDARY = SLATE[40];
export const TEXT_DISABLED = SLATE[60];
