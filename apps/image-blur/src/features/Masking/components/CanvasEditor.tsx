import { Box, Typography } from '@mui/material';


import { useMaskingCanvas } from '../hooks';
import { Toolbar } from './Toolbar';

import type { LoadedImage } from '../types';


interface CanvasEditorProps {
  image: LoadedImage;
}

export function CanvasEditor({ image }: CanvasEditorProps) {
  const {
    canvasRef,
    canUndo,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    undo,
    reset,
    download,
  } = useMaskingCanvas({ image });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toolbar canUndo={canUndo} onUndo={undo} onReset={reset} onDownload={download} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: { xs: '12px', md: '20px' },
          borderRadius: 'var(--radius)',
          bgcolor: 'var(--muted)',
          border: '1px solid var(--border)',
        }}
      >
        <Box
          component="canvas"
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          sx={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            borderRadius: '8px',
            cursor: isDrawing ? 'grabbing' : 'crosshair',
            // 없으면 모바일에서 화면이 함께 스크롤돼 획이 그려지지 않는다
            touchAction: 'none',
          }}
        />
      </Box>

      <Typography variant="body3" sx={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>
        가리고 싶은 부분을 마우스로 문지르거나 드래그하세요. 되돌리기는 최근 10단계까지 가능해요.
      </Typography>
    </Box>
  );
}
