import { type ThemeOptions, createTheme } from '@mui/material';

import {
  BACKGROUND,
  BORDER,
  EMERALD,
  ERROR,
  INDIGO,
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

const paletteTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: augmentColor({ color: INDIGO, ...SHADES }),
    secondary: augmentColor({ color: EMERALD, ...SHADES }),
    slate: augmentColor({ color: SLATE, ...SHADES }),
    indigo: augmentColor({ color: INDIGO, ...SHADES }),
    emerald: augmentColor({ color: EMERALD, ...SHADES }),
    success: { main: SUCCESS },
    error: { main: ERROR },
    warning: { main: WARNING },
    background: { default: BACKGROUND, paper: SURFACE },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY, disabled: TEXT_DISABLED },
    divider: BORDER,
  },
}).palette;

const typographyTheme: ThemeOptions['typography'] = {
  fontFamily: 'Pretendard',
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
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BACKGROUND,
          color: TEXT_PRIMARY,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          ...LABEL_TYPOGRAPHY.L,
          textTransform: 'none',
          borderRadius: '10px',
          paddingInline: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SURFACE,
          boxShadow: SHADOW.CARD,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: INDIGO[50],
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          ...LABEL_TYPOGRAPHY.L,
          textTransform: 'none',
          color: TEXT_SECONDARY,
          borderColor: BORDER,
          '&.Mui-selected': {
            color: TEXT_PRIMARY,
            backgroundColor: INDIGO[80],
            '&:hover': {
              backgroundColor: INDIGO[70],
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...BODY_TYPOGRAPHY.XS,
          backgroundColor: SLATE[100],
        },
      },
    },
  },
});
