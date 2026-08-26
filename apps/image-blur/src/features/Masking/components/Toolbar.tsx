import BlurOnIcon from '@mui/icons-material/BlurOn';
import BrushIcon from '@mui/icons-material/Brush';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DownloadIcon from '@mui/icons-material/Download';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import GridOnIcon from '@mui/icons-material/GridOn';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, Button, Divider, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { BRUSH_SIZE_LABEL, BRUSH_THICKNESS, INTENSITY_RANGE, MASK_MODE_LABEL, isAdjustableMode } from '../constants';
import { useBrushSize, useIntensity, useMaskMode, useMaskShape, useToolActions } from '../store';

import type { BrushSize, MaskMode, MaskShape } from '../types';

interface ToolbarProps {
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onDownload: () => void;
}

const BRUSH_SIZES = Object.keys(BRUSH_THICKNESS) as BrushSize[];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
      <Typography variant="label2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export function Toolbar({ canUndo, onUndo, onReset, onDownload }: ToolbarProps) {
  const mode = useMaskMode();
  const shape = useMaskShape();
  const brushSize = useBrushSize();
  const intensity = useIntensity();
  const { setMode, setShape, setBrushSize, setIntensity } = useToolActions();

  const adjustable = isAdjustableMode(mode);
  const range = adjustable ? INTENSITY_RANGE[mode] : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'flex-end' },
        gap: '20px',
        p: '16px',
        borderRadius: '14px',
        bgcolor: 'background.paper',
        border: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Field label="가리는 방식">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={mode}
          onChange={(_, value: MaskMode | null) => {
            if (value) {
              setMode(value);
            }
          }}
        >
          <ToggleButton value="mosaic">
            <GridOnIcon sx={{ width: 18, height: 18, mr: '6px' }} />
            {MASK_MODE_LABEL.mosaic}
          </ToggleButton>
          <ToggleButton value="blur">
            <BlurOnIcon sx={{ width: 18, height: 18, mr: '6px' }} />
            {MASK_MODE_LABEL.blur}
          </ToggleButton>
          <ToggleButton value="fill">
            <FormatColorFillIcon sx={{ width: 18, height: 18, mr: '6px' }} />
            {MASK_MODE_LABEL.fill}
          </ToggleButton>
        </ToggleButtonGroup>
      </Field>

      <Field label="그리는 형태">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={shape}
          onChange={(_, value: MaskShape | null) => {
            if (value) {
              setShape(value);
            }
          }}
        >
          <ToggleButton value="pen">
            <BrushIcon sx={{ width: 18, height: 18, mr: '6px' }} />
            펜
          </ToggleButton>
          <ToggleButton value="rect">
            <CropSquareIcon sx={{ width: 18, height: 18, mr: '6px' }} />
            사각형
          </ToggleButton>
        </ToggleButtonGroup>
      </Field>

      <Field label="펜 굵기">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={brushSize}
          disabled={shape === 'rect'}
          onChange={(_, value: BrushSize | null) => {
            if (value) {
              setBrushSize(value);
            }
          }}
        >
          {BRUSH_SIZES.map(size => (
            <ToggleButton key={size} value={size}>
              {BRUSH_SIZE_LABEL[size]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Field>

      {range ? (
        <Field label={`가리는 강도 · ${intensity}`}>
          <Slider
            size="small"
            value={intensity}
            min={range.min}
            max={range.max}
            step={range.step}
            onChange={(_, value) => {
              setIntensity(value as number);
            }}
            sx={{ minWidth: { xs: '100%', lg: 160 } }}
          />
        </Field>
      ) : (
        <Field label="가리는 강도">
          <Typography variant="body4" sx={{ color: 'text.disabled', minWidth: { lg: 160 } }}>
            채우기는 세기 조절이 없습니다
          </Typography>
        </Field>
      )}

      <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', lg: 'block' } }} />

      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', ml: { lg: 'auto' } }}>
        <Button variant="outlined" color="inherit" startIcon={<UndoIcon />} disabled={!canUndo} onClick={onUndo}>
          되돌리기
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<RestartAltIcon />} onClick={onReset}>
          전체 지우기
        </Button>
        <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} onClick={onDownload}>
          저장하기
        </Button>
      </Box>
    </Box>
  );
}
