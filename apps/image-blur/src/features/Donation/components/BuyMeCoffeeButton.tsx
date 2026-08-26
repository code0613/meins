import { useState } from 'react';

import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { Box, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

import { DONATION_METHODS } from '../constants';

export function BuyMeCoffeeButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<LocalCafeIcon />}
        onClick={handleOpen}
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          color: 'var(--primary)',
          bgcolor: 'color-mix(in oklab, var(--primary) 12%, var(--card))',
          border: '1px solid',
          borderColor: 'color-mix(in oklab, var(--primary) 32%, transparent)',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: 'color-mix(in oklab, var(--primary) 20%, var(--card))',
            borderColor: 'color-mix(in oklab, var(--primary) 48%, transparent)',
            boxShadow: 'none',
          },
        }}
      >
        커피 사주기
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 'var(--radius)',
            bgcolor: 'var(--card)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogContent
          sx={{
            px: { xs: '20px', sm: '32px' },
            py: { xs: '28px', sm: '36px' },
          }}
        >
          <Typography
            variant="heading2"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--foreground)',
              mb: '28px',
            }}
          >
            Buy Me A Coffee ☕
          </Typography>

          <Stack direction="row" spacing="16px" justifyContent="center">
            {DONATION_METHODS.map(method => (
              <Stack key={method.id} spacing="14px" alignItems="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    px: '14px',
                    py: '6px',
                    borderRadius: '8px',
                    bgcolor: method.brandColor,
                  }}
                >
                  <Typography variant="label2" sx={{ color: method.labelColor }}>
                    {method.label}
                  </Typography>
                </Box>

                <Box
                  component="img"
                  src={method.qrSrc}
                  alt={`${method.label} 송금 QR 코드`}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    maxWidth: '160px',
                    aspectRatio: '1 / 1',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                  }}
                />
              </Stack>
            ))}
          </Stack>

          <Stack spacing="4px" sx={{ mt: '24px' }}>
            <Typography
              variant="body4"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'var(--muted-foreground)',
              }}
            >
              QR을 찍으면 송금 화면이 열려요. 안 보내셔도 괜찮아요.
            </Typography>
            <Typography
              variant="body4"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'var(--muted-foreground)',
              }}
            >
              감사합니다.
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
