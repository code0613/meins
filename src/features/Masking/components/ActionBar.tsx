import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, Button } from '@mui/material';

import { UNDO_SHORTCUT_LABEL } from '../constants';

interface ActionBarProps {
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onDownload: () => void;
}

export function ActionBar({ canUndo, onUndo, onReset, onDownload }: ActionBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: { xs: 'stretch', md: 'flex-end' },
        // 사진이 길면 편집 중 버튼이 화면 밖으로 밀린다. 손이 닿는 곳에 붙여둔다
        position: { xs: 'sticky', md: 'static' },
        bottom: 0,
        zIndex: 5,
        py: { xs: '12px', md: 0 },
        bgcolor: { xs: 'var(--background)', md: 'transparent' },
        borderTop: { xs: '1px solid var(--border)', md: 'none' },
      }}
    >
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<UndoIcon />}
        disabled={!canUndo}
        onClick={onUndo}
        title={`되돌리기 (${UNDO_SHORTCUT_LABEL})`}
        sx={{ flex: { xs: 1, md: 'none' } }}
      >
        되돌리기
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        sx={{ flex: { xs: 1, md: 'none' } }}
      >
        전체 지우기
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DownloadIcon />}
        onClick={onDownload}
        sx={{ flex: { xs: 1, md: 'none' } }}
      >
        저장하기
      </Button>
    </Box>
  );
}
