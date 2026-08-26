import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import { Box, Button, Stack, Typography } from '@mui/material';

function ErrorFallback() {
  return (
    <Stack spacing="16px" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', px: '24px' }}>
      <Typography variant="heading2">문제가 생겨 화면을 열지 못했어요</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        사진은 이 기기 밖으로 나가지 않았으니 안심하세요. 새로 고침하면 다시 시작할 수 있어요.
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          window.location.reload();
        }}
      >
        새로 고침
      </Button>
    </Stack>
  );
}

function App() {
  return (
    <Box component="main" width="100%" minHeight="100vh">
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Outlet />
      </ErrorBoundary>
    </Box>
  );
}

export default App;
