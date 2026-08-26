import { EMERALD, SLATE } from '@meins/styles';
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
        border: `1px solid ${EMERALD[80]}`,
        bgcolor: 'rgba(16, 185, 129, 0.10)',
      }}
    >
      <LockIcon
        sx={{
          width: isHeader ? 18 : 16,
          height: isHeader ? 18 : 16,
          color: EMERALD[40],
        }}
      />
      <Typography
        variant={isHeader ? 'subtitle3' : 'body4'}
        sx={{
          color: EMERALD[30],
        }}
      >
        {isHeader ? '개인정보 유출 걱정 없는 100% 로컬 처리' : LOCAL_ONLY_NOTICE}
      </Typography>
      {isHeader && (
        <Typography
          variant="body4"
          sx={{
            color: SLATE[40],
            display: { xs: 'none', sm: 'block' },
          }}
        >
          업로드 없음 · 저장 없음
        </Typography>
      )}
    </Box>
  );
}
