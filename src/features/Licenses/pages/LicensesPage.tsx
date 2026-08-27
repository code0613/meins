import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Stack, Typography } from '@mui/material';
import { SERVICE_NAME } from 'src/features/common/constants/text';

import licenses from '../data/licenses.json';

import type { LicenseEntry } from '../types';

const entries = licenses as LicenseEntry[];

export function LicensesPage() {
  const summary = useMemo(() => {
    const counts = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.license] = (acc[entry.license] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: '24px', md: '40px' } }}>
      <Stack spacing="24px">
        <Box>
          <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: '12px', ml: '-8px' }}>
            돌아가기
          </Button>
          <Typography variant="heading1" sx={{ color: 'var(--foreground)' }}>
            오픈소스 라이선스
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--muted-foreground)', mt: '8px' }}>
            {SERVICE_NAME}는 아래 오픈소스 소프트웨어를 사용합니다. 만들어주신 분들께 감사드립니다.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            p: '16px',
            borderRadius: 'var(--radius)',
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <Typography variant="subtitle3" sx={{ color: 'var(--foreground)', width: '100%', mb: '4px' }}>
            총 {entries.length}개 패키지
          </Typography>
          {summary.map(([license, count]) => (
            <Box
              key={license}
              sx={{
                px: '10px',
                py: '4px',
                borderRadius: '999px',
                bgcolor: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              <Typography variant="body4" sx={{ color: 'var(--muted-foreground)' }}>
                {license} · {count}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box>
          {entries.map(entry => (
            <Accordion
              key={entry.name}
              disableGutters
              elevation={0}
              sx={{
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                mb: '8px',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--muted-foreground)' }} />}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', minWidth: 0 }}>
                  <Typography variant="subtitle3" sx={{ color: 'var(--foreground)' }}>
                    {entry.name}
                  </Typography>
                  <Typography variant="body4" sx={{ color: 'var(--muted-foreground)' }}>
                    {entry.version} · {entry.license}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: '1px solid var(--border)', pt: '16px' }}>
                <Stack spacing="12px">
                  {entry.author && (
                    <Typography variant="body3" sx={{ color: 'var(--muted-foreground)' }}>
                      {entry.author}
                    </Typography>
                  )}
                  {entry.repository && (
                    <Typography
                      component="a"
                      href={entry.repository}
                      target="_blank"
                      rel="noreferrer noopener"
                      variant="body3"
                      sx={{ color: 'var(--primary)', wordBreak: 'break-all' }}
                    >
                      {entry.repository}
                    </Typography>
                  )}
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      p: '14px',
                      borderRadius: 'calc(var(--radius) - 4px)',
                      bgcolor: 'var(--muted)',
                      color: 'var(--foreground)',
                      fontSize: '12px',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 320,
                      overflowY: 'auto',
                    }}
                  >
                    {entry.licenseText ?? `${entry.license} 라이선스로 배포됩니다. 전문은 저장소를 확인해주세요.`}
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    </Container>
  );
}
