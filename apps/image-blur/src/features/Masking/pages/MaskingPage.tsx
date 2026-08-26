import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { SERVICE_NAME } from 'src/features/common/constants/text';

import { CanvasEditor, ImageUploader, SecurityNotice } from '../components';
import { useImageLoader } from '../hooks';

export function MaskingPage() {
  const { image, isLoading, loadFromList, clear } = useImageLoader();

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid var(--border)',
          // 스크롤한 캔버스가 헤더 뒤로 비쳐 지나가도 글자가 읽히도록 흐린다
          backdropFilter: 'blur(8px)',
          bgcolor: 'color-mix(in oklab, var(--background) 80%, transparent)',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            py: '12px',
          }}
        >
          <Typography variant="heading3" sx={{ color: 'var(--foreground)' }}>
            {SERVICE_NAME}
          </Typography>
          <SecurityNotice variant="header" />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: '24px', md: '40px' } }}>
        <Stack spacing="28px">
          <Box>
            <Typography
              variant="display2"
              sx={{
                color: 'var(--foreground)',
                fontSize: 'clamp(1.05rem, 7.2vw, 2.25rem)',
                lineHeight: 1.35,
                whiteSpace: 'nowrap',
              }}
            >
              사진 속 개인정보, 여기서 가리세요
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--muted-foreground)', mt: '6px' }}>
              이름, 주민번호, 주소를 문질러 지우면 됩니다.
            </Typography>
          </Box>

          {image ? (
            <Stack spacing="16px">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'var(--muted-foreground)' }}>
                  {image.baseName} · {image.width} × {image.height}
                </Typography>
                <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={clear}>
                  다른 사진 열기
                </Button>
              </Box>

              <CanvasEditor image={image} />
            </Stack>
          ) : (
            <ImageUploader isLoading={isLoading} onSelectFiles={loadFromList} />
          )}
        </Stack>
      </Container>
    </>
  );
}
