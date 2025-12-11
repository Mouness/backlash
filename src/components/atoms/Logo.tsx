import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const Logo: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Original Brand Colors
  const brandPrimary = '#5B7C99';
  const brandSecondary = '#A4C3D2';
  const brandDark = '#2F516C';

  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
    >
      {/* Abstract SVG Icon: Representing fragmentation/backsliding in a federal structure */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="5" width="14" height="14" rx="2" fill={brandPrimary} />
        <rect x="21" y="5" width="14" height="14" rx="2" fill={brandSecondary} />
        <rect x="5" y="21" width="14" height="14" rx="2" fill={brandSecondary} />
        <rect x="21" y="21" width="14" height="14" rx="2" fill={brandDark} />
        {/* A "crack" or "shift" line to symbolize backlash/sliding */}
        <path d="M0 40L40 0" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      </svg>

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
