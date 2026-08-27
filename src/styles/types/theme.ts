import type React from 'react';

import type { Palette, PaletteColor, PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    heading1: React.CSSProperties;
    heading2: React.CSSProperties;
    heading3: React.CSSProperties;
    subtitle3: React.CSSProperties;
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    label1: React.CSSProperties;
    label2: React.CSSProperties;
    label3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display1?: React.CSSProperties;
    display2?: React.CSSProperties;
    heading1?: React.CSSProperties;
    heading2?: React.CSSProperties;
    heading3?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    label1?: React.CSSProperties;
    label2?: React.CSSProperties;
    label3?: React.CSSProperties;
  }

  interface Palette {
    slate: PaletteColor;
    indigo: PaletteColor;
    emerald: PaletteColor;
  }

  interface PaletteOptions {
    slate?: PaletteOptions['primary'];
    indigo?: PaletteOptions['primary'];
    emerald?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
    display2: true;
    heading1: true;
    heading2: true;
    heading3: true;
    subtitle1: true;
    subtitle2: true;
    subtitle3: true;
    body1: true;
    body2: true;
    body3: true;
    body4: true;
    label1: true;
    label2: true;
    label3: true;

    h1: false;
    h2: false;
    h3: false;
    h4: false;
    h5: false;
    h6: false;
    caption: false;
    overline: false;
    button: false;
  }
}

export type { Palette, PaletteOptions };
