/*
 *  NOTICE
 *  화면에는 globals의 CSS 변수(oklch)가 쓰이고, 여기 hex는 그 sRGB 등가값이다.
 *  MUI가 색을 밝히거나 어둡게 계산할 때 oklch 문자열을 파싱하지 못해 hex를 함께 둔다.
 *  값을 고칠 때는 style/globals.css의 :root와 반드시 같이 맞춘다.
 */

// Main Color — azure accent
export const PRIMARY = '#006DC4';
export const PRIMARY_LIGHT = '#2D8CE5';
export const PRIMARY_DARK = '#0051A6';
export const PRIMARY_FOREGROUND = '#FFFFFF';

/** 배경과 표면을 이루는 중립 톤. 값이 클수록 어둡다 */
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

// Sub Color
export const SUCCESS = '#00875A';
export const ERROR = '#D4183D';
export const WARNING = '#B45309';

// Surface
export const BACKGROUND = SLATE[5];
/** 배경 위에 올라가는 카드·패널 표면 */
export const SURFACE = WHITE;
export const BORDER = SLATE[20];
export const MUTED = SLATE[10];

// Text
export const TEXT_PRIMARY = SLATE[90];
export const TEXT_SECONDARY = SLATE[50];
export const TEXT_DISABLED = SLATE[40];
