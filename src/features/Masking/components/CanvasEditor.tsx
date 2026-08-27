import { useEffect, useRef } from 'react';

import { Box, Typography } from '@mui/material';


import { useMaskingCanvas } from '../hooks';
import { ActionBar } from './ActionBar';
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

  const stageRef = useRef<HTMLDivElement | null>(null);

  // 사진을 고르면 다음 할 일은 문지르는 것이다. 화면이 거기까지 따라가지 않으면 아무 일도 안 일어난 것처럼 보인다
  useEffect(() => {
    // 마운트 직후에는 캔버스 크기가 아직 안 잡혀 문서가 스크롤되지 않는다. 다음 태스크로 미룬다.
    // rAF와 ResizeObserver는 숨은 탭에서 멈춰 신뢰할 수 없다
    const timer = window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      stageRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toolbar />

      <Box
        ref={stageRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          // 헤더가 sticky라 그만큼 띄워야 캔버스 윗변이 가려지지 않는다
          scrollMarginTop: '72px',
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

      <ActionBar canUndo={canUndo} onUndo={undo} onReset={reset} onDownload={download} />

      <Typography variant="body3" sx={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>
        가리고 싶은 부분을 마우스로 문지르거나 드래그하세요.
      </Typography>
    </Box>
  );
}
