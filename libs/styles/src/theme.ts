import { type ThemeOptions, createTheme } from '@mui/material';

import {
  BACKGROUND,
  BORDER,
  ERROR,
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_FOREGROUND,
  PRIMARY_LIGHT,
  SLATE,
  SUCCESS,
  SURFACE,
  TEXT_DISABLED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  WARNING,
} from './variables/color';
import { SHADOW } from './variables/shadow';
import {
  BODY_TYPOGRAPHY,
  DISPLAY_TYPOGRAPHY,
  HEADING_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  SUBTITLE_TYPOGRAPHY,
} from './variables/typography';

import './types';

const { palette: defaultPalette } = createTheme();
const { augmentColor } = defaultPalette;

const SHADES = { mainShade: 50, lightShade: 30, darkShade: 70 } as const;

/** CSS 변수를 그대로 쓰는 값. 실제 렌더링은 globals.css의 oklch가 담당한다 */
const VAR = {
  background: 'var(--background)',
  card: 'var(--card)',
  border: 'var(--border)',
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',
  foreground: 'var(--foreground)',
  mutedForeground: 'var(--muted-foreground)',
  muted: 'var(--muted)',
  radius: 'var(--radius)',
};

const paletteTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: PRIMARY, light: PRIMARY_LIGHT, dark: PRIMARY_DARK, contrastText: PRIMARY_FOREGROUND },
    secondary: augmentColor({ color: SLATE, ...SHADES }),
    slate: augmentColor({ color: SLATE, ...SHADES }),
    success: { main: SUCCESS },
    error: { main: ERROR },
    warning: { main: WARNING },
    background: { default: BACKGROUND, paper: SURFACE },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY, disabled: TEXT_DISABLED },
    divider: BORDER,
  },
}).palette;

const typographyTheme: ThemeOptions['typography'] = {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display1: DISPLAY_TYPOGRAPHY.L,
  display2: DISPLAY_TYPOGRAPHY.M,
  heading1: HEADING_TYPOGRAPHY.L,
  heading2: HEADING_TYPOGRAPHY.M,
  heading3: HEADING_TYPOGRAPHY.S,
  subtitle1: SUBTITLE_TYPOGRAPHY.L,
  subtitle2: SUBTITLE_TYPOGRAPHY.M,
  subtitle3: SUBTITLE_TYPOGRAPHY.S,
  body1: BODY_TYPOGRAPHY.L,
  body2: BODY_TYPOGRAPHY.M,
  body3: BODY_TYPOGRAPHY.S,
  body4: BODY_TYPOGRAPHY.XS,
  label1: LABEL_TYPOGRAPHY.L,
  label2: LABEL_TYPOGRAPHY.M,
  label3: LABEL_TYPOGRAPHY.S,
};

export const meinsDesignSystemTheme = createTheme({
  palette: paletteTheme,
  typography: typographyTheme,
  // --radius가 0.75rem이라 12px과 같다
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: VAR.background,
          color: VAR.foreground,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          ...LABEL_TYPOGRAPHY.L,
          textTransform: 'none',
          borderRadius: 'calc(var(--radius) - 2px)',
          paddingInline: '16px',
        },
        containedPrimary: {
          backgroundColor: VAR.primary,
          color: VAR.primaryForeground,
          '&:hover': { backgroundColor: PRIMARY_DARK },
        },
        outlined: {
          borderColor: VAR.border,
          color: VAR.foreground,
          '&:hover': { borderColor: VAR.border, backgroundColor: VAR.muted },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: VAR.card,
          boxShadow: SHADOW.CARD,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: VAR.primary },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          ...LABEL_TYPOGRAPHY.L,
          textTransform: 'none',
          color: VAR.mutedForeground,
          borderColor: VAR.border,
          backgroundColor: VAR.card,
          '&:hover': { backgroundColor: VAR.muted },
          '&.Mui-selected': {
            color: VAR.primaryForeground,
            backgroundColor: VAR.primary,
            '&:hover': { backgroundColor: PRIMARY_DARK },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { ...BODY_TYPOGRAPHY.XS, backgroundColor: SLATE[90] },
      },
    },
  },
});
