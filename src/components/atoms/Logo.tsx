import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const Logo: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
    >
      <img
        src={theme.palette.mode === 'dark' ? '/logo_white.svg' : '/logo.svg'}
        alt="Backlash Logo"
        width="65"
        height="52"
      />

      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}
        >
          {t('brand.name')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            letterSpacing: '1px',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
          }}
        >
          {t('brand.suffix')}
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
