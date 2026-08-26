import { css } from '@emotion/react';
import { BACKGROUND, SLATE, TEXT_PRIMARY } from '@meins/styles';

export const globalStyles = css`
  @font-face {
    font-family: 'Pretendard';
    font-weight: 400;
    font-display: swap;
    src: local('Pretendard Regular');
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    background-color: ${BACKGROUND};
    color: ${TEXT_PRIMARY};
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background-color: ${SLATE[70]};
  }
`;
