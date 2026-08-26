import { createBrowserRouter } from 'react-router-dom';

import { MaskingPage } from 'src/features/Masking/pages';

import App from '../App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ index: true, element: <MaskingPage /> }],
  },
]);
