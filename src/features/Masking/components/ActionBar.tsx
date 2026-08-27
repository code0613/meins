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

/** 좁은 화면에서 3등분하면 '전체 지우기'가 개행된다. 보조 버튼 둘이 한 줄, 저장하기는 아래 한 줄 */
const secondarySx = {
  flex: { xs: '1 1 calc(50% - 4px)', md: '0 0 auto' },
  whiteSpace: 'nowrap',
} as const;

const primarySx = {
  flex: { xs: '1 1 100%', md: '0 0 auto' },
  whiteSpace: 'nowrap',
} as const;

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
        sx={secondarySx}
      >
        되돌리기
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        sx={secondarySx}
      >
        전체 지우기
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DownloadIcon />}
        onClick={onDownload}
        sx={primarySx}
      >
        저장하기
      </Button>
    </Box>
  );
}
