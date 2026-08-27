import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Global } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'src/components';
import { designSystemTheme, globalStyles } from 'src/styles';

import { router } from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={designSystemTheme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
