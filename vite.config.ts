import react from '@vitejs/plugin-react-swc';
import { type ConfigEnv, type Plugin, defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * 사진이 기기 밖으로 나가지 않는다는 약속을 브라우저가 강제하게 만든다.
 * connect-src 'none'이면 코드에 실수로 fetch가 섞여 들어가도 요청 자체가 차단된다.
 * 개발 중에는 Vite HMR이 WebSocket을 쓰므로 운영 빌드에만 넣는다.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  // emotion과 MUI가 런타임에 style 태그를 만들어 넣는다
  "style-src 'self' 'unsafe-inline'",
  // 사용자가 고른 사진은 blob:, 저장 직전 결과는 data:로 다룬다
  "img-src 'self' blob: data:",
  "font-src 'self'",
  // Vercel Web Analytics가 같은 오리진의 /_vercel/insights로 수집 요청을 보낸다
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

function cspPlugin(isProduction: boolean): Plugin {
  return {
    name: 'meins-csp',
    transformIndexHtml(html) {
      if (!isProduction) {
        return html;
      }
      return html.replace(
        '</head>',
        `  <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />\n  </head>`,
      );
    },
  };
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) =>
  defineConfig({
    plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.app.json'] }), svgr(), cspPlugin(mode === 'production')],
    // 이미지 처리를 전부 브라우저에서 하므로 API 프록시가 없다
    build: {
      sourcemap: mode !== 'production',
    },
    preview: {
      port: 4173,
      host: true,
    },
  });
