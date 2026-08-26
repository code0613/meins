import LockIcon from '@mui/icons-material/Lock';
import { Box, Typography } from '@mui/material';
import { LOCAL_ONLY_NOTICE } from 'src/features/common/constants/text';

interface SecurityNoticeProps {
  variant?: 'header' | 'badge';
}

export function SecurityNotice({ variant = 'badge' }: SecurityNoticeProps) {
  const isHeader = variant === 'header';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        px: isHeader ? '14px' : '10px',
        py: isHeader ? '8px' : '6px',
        borderRadius: '999px',
        border: '1px solid',
        borderColor: 'color-mix(in oklab, var(--primary) 24%, transparent)',
        bgcolor: 'color-mix(in oklab, var(--primary) 8%, transparent)',
      }}
    >
      <LockIcon
        sx={{
          width: isHeader ? 18 : 16,
          height: isHeader ? 18 : 16,
          color: 'var(--primary)',
        }}
      />
      <Typography variant={isHeader ? 'subtitle3' : 'body4'} sx={{ color: 'var(--primary)' }}>
        {isHeader ? '사진은 이 기기에서만 처리' : LOCAL_ONLY_NOTICE}
      </Typography>
      {isHeader && (
        <Typography
          variant="body4"
          sx={{
            color: 'var(--muted-foreground)',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          업로드 없음 · 저장 없음
        </Typography>
      )}
    </Box>
  );
}
