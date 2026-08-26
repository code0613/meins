import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Global } from '@emotion/react';
import { SnackbarProvider } from '@meins/components';
import { meinsDesignSystemTheme } from '@meins/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { router } from './router';
import { globalStyles } from './style/global';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={meinsDesignSystemTheme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
