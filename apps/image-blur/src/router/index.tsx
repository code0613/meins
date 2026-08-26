import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { MaskingPage } from 'src/features/Masking/pages';

import App from '../App';

const LicensesPage = lazy(async () => {
  const module = await import('src/features/Licenses/pages');
  return { default: module.LicensesPage };
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MaskingPage /> },
      { path: 'licenses', element: <LicensesPage /> },
    ],
  },
]);
