import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { SERVICE_NAME } from 'src/features/common/constants/text';

import { CanvasEditor, ImageUploader, SecurityNotice } from '../components';
import { useImageLoader } from '../hooks';

export function MaskingPage() {
  const { image, isLoading, loadFromList, clear } = useImageLoader();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: '24px', md: '40px' } }}>
      <Stack spacing="28px">
        <Stack spacing="12px" alignItems="flex-start">
          <SecurityNotice variant="header" />

          <Box>
            <Typography variant="display2" sx={{ color: 'text.primary' }}>
              {SERVICE_NAME}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: '6px' }}>
              사진 속 이름, 주민번호, 주소를 문질러 가리세요. 사진은 이 브라우저를 벗어나지 않습니다.
            </Typography>
          </Box>
        </Stack>

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
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {image.baseName} · {image.width} × {image.height}
              </Typography>
              <Button color="inherit" startIcon={<RestartAltIcon />} onClick={clear}>
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
  );
}
