import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist', '**/.eslintrc.cjs'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2020 },
      parserOptions: {
        // tsconfig.json은 references만 담고 있어 파일이 잡히지 않는다. 실제 프로젝트를 직접 가리킨다
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    settings: {
      // 'detect'는 eslint-plugin-react가 ESLint 10 컨텍스트에서 깨져 버전을 직접 지정한다
      react: { version: '19.0' },
    },
    rules: {
      // react
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // react-hooks
      'react-hooks/exhaustive-deps': 'off',

      // general
      'no-console': 'off',
      'arrow-parens': 'off',

      // import
      'import/no-absolute-path': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/prefer-default-export': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [
            {
              pattern: '{react*,react*/**}',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],

      // typescript
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/naming-convention': [
        'error',
        { format: ['camelCase', 'UPPER_CASE', 'PascalCase'], selector: 'variable', leadingUnderscore: 'allow' },
        { format: ['camelCase', 'PascalCase'], selector: 'function' },
        { format: ['PascalCase'], selector: 'interface' },
        { format: ['PascalCase'], selector: 'typeAlias' },
      ],
    },
  },
  {
    // 사진이 기기 밖으로 나가지 않는 것이 이 서비스의 전제다. AGENTS.md를 볼 것
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: '이 서비스는 외부와 통신하지 않는다. AGENTS.md를 볼 것' },
        { name: 'XMLHttpRequest', message: '이 서비스는 외부와 통신하지 않는다. AGENTS.md를 볼 것' },
        { name: 'WebSocket', message: '이 서비스는 외부와 통신하지 않는다. AGENTS.md를 볼 것' },
        { name: 'EventSource', message: '이 서비스는 외부와 통신하지 않는다. AGENTS.md를 볼 것' },
        { name: 'localStorage', message: '탭을 닫으면 아무것도 남지 않는다는 것이 README의 약속이다' },
        { name: 'sessionStorage', message: '탭을 닫으면 아무것도 남지 않는다는 것이 README의 약속이다' },
        { name: 'indexedDB', message: '탭을 닫으면 아무것도 남지 않는다는 것이 README의 약속이다' },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'navigator',
          property: 'sendBeacon',
          message: '이 서비스는 외부와 통신하지 않는다. AGENTS.md를 볼 것',
        },
      ],
    },
  },
);
