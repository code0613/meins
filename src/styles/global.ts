import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    color-scheme: light;
    --radius: 0.75rem;

    /* slate-50 canvas / slate-900 text */
    --background: oklch(0.984 0.003 247.858);
    --foreground: oklch(0.208 0.042 265.755);

    /* white surfaces */
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.208 0.042 265.755);

    /* azure accent */
    --primary: oklch(0.53 0.16 251);
    --primary-foreground: oklch(1 0 0);

    /* slate-100 / slate-500 */
    --secondary: oklch(0.968 0.007 247.896);
    --secondary-foreground: oklch(0.279 0.041 260.031);
    --muted: oklch(0.968 0.007 247.896);
    --muted-foreground: oklch(0.554 0.046 257.417);

    --border: oklch(0.929 0.013 255.508);
    --input: oklch(0.929 0.013 255.508);
  }

  * {
    box-sizing: border-box;
    border-color: var(--border);
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    background-color: var(--background);
    color: var(--foreground);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* 라이트 모드 그리드 배경 패턴 */
  .grid-backdrop {
    background-image: linear-gradient(
        to right,
        color-mix(in oklab, var(--foreground) 7%, transparent) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 7%, transparent) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  ::selection {
    background-color: color-mix(in oklab, var(--primary) 20%, transparent);
  }
`;
