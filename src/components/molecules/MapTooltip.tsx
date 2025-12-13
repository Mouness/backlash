import React from 'react';
import { Box, Typography, Paper, Chip, Divider, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getScoreLevel, DemocraticScore } from '../../utils/scoreUtils';

interface MapTooltipProps {
  isoCode: string | null;
  score: DemocraticScore | undefined;
}

const MapTooltip: React.FC<MapTooltipProps> = ({ isoCode, score }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!isoCode) return null;

  const level = score ? getScoreLevel(score) : null;
  const name = t(`countries.${isoCode}.name`);
  const desc = t(`countries.${isoCode}.desc`);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        maxWidth: 300,
        borderRadius: 0, // Sharp corners
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          {name}
        </Typography>
        {level && (
          <Chip
            label={t(level.key)}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              ml: 1,
              fontWeight: 'bold',
              borderRadius: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              ...level.style,
            }}
            color={
              level.color as
                | 'default'
                | 'primary'
                | 'secondary'
                | 'error'
                | 'info'
                | 'success'
                | 'warning'
            }
          />
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
        {desc}
      </Typography>
    </Paper>
  );
};

export default MapTooltip;
