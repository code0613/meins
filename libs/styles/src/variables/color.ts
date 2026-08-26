/*
 *  화면에 칠해지는 색은 style/global.ts의 :root 변수(oklch)다.
 *  MUI가 oklch를 파싱하지 못해 같은 색의 hex를 여기 둔다.
 *  값을 고칠 때는 양쪽을 반드시 함께 맞춘다.
 */

export const PRIMARY = '#006DC4';
export const PRIMARY_LIGHT = '#2D8CE5';
export const PRIMARY_DARK = '#0051A6';
export const PRIMARY_FOREGROUND = '#FFFFFF';

export const SLATE = {
  5: '#F8FAFC', // background
  10: '#F1F5F9', // secondary / muted
  20: '#E2E8F0', // border
  30: '#CBD5E1',
  40: '#90A1B9',
  50: '#62748E', // muted-foreground
  60: '#45556C',
  70: '#314158',
  80: '#1D293D', // secondary-foreground
  90: '#0F172B', // foreground
  100: '#020618',
};

export const BLACK = '#000000';
export const WHITE = '#FFFFFF';

export const SUCCESS = '#00875A';
export const ERROR = '#D4183D';
export const WARNING = '#B45309';

export const BACKGROUND = SLATE[5];
export const SURFACE = WHITE;
export const BORDER = SLATE[20];
export const MUTED = SLATE[10];

export const TEXT_PRIMARY = SLATE[90];
export const TEXT_SECONDARY = SLATE[50];
export const TEXT_DISABLED = SLATE[40];
