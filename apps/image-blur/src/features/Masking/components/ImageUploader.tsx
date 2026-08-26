import { useRef, useState } from 'react';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Button, CircularProgress, Typography } from '@mui/material';


import { ACCEPTED_EXTENSION_TEXT, ACCEPTED_MIME_TYPES } from '../constants';
import { SecurityNotice } from './SecurityNotice';

interface ImageUploaderProps {
  isLoading: boolean;
  onSelectFiles: (fileList: FileList | null) => void;
}

export function ImageUploader({ isLoading, onSelectFiles }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleOpenPicker = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      onDragOver={event => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onDrop={event => {
        event.preventDefault();
        setIsDragging(false);
        onSelectFiles(event.dataTransfer.files);
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        px: '24px',
        py: { xs: '48px', md: '72px' },
        borderRadius: 'var(--radius)',
        border: '2px dashed',
        borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
        bgcolor: isDragging ? 'color-mix(in oklab, var(--primary) 6%, var(--card))' : 'var(--card)',
        transition: 'border-color 160ms ease, background-color 160ms ease',
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress size={36} />
      ) : (
        <CloudUploadOutlinedIcon sx={{ width: 44, height: 44, color: 'var(--muted-foreground)' }} />
      )}

      <Box>
        <Typography variant="heading3" sx={{ color: 'text.primary', mb: '6px' }}>
          가릴 사진을 여기에 놓아주세요
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          주민등록증, 영수증, 등본처럼 개인정보가 담긴 사진을 안전하게 가릴 수 있어요
        </Typography>
      </Box>

      <Button variant="contained" size="large" onClick={handleOpenPicker} disabled={isLoading}>
        사진 선택하기
      </Button>

      <Typography variant="body4" sx={{ color: 'text.disabled' }}>
        {ACCEPTED_EXTENSION_TEXT} 지원
      </Typography>

      <SecurityNotice />

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPTED_MIME_TYPES.join(',')}
        onChange={event => {
          onSelectFiles(event.target.files);
          // 같은 파일을 다시 골라도 change가 일어나도록 비운다
          event.target.value = '';
        }}
      />
    </Box>
  );
}
