import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MapLegend: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        p: 2,
        bgcolor: 'rgba(255,255,255,0.9)',
        borderRadius: 2,
        maxWidth: 300,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Typography variant="body2" fontWeight="bold" color="primary">
        {t('map.title')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('map.description')}
      </Typography>
    </Paper>
  );
};

export default MapLegend;
