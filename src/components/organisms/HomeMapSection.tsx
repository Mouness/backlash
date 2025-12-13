import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InteractiveMap from './InteractiveMap';
import { DemocraticScore } from '../../types/models';
import type { Country } from '../../types/models';

interface HomeMapSectionProps {
  countries: Country[];
}

const HomeMapSection: React.FC<HomeMapSectionProps> = ({ countries }) => {
  const { t } = useTranslation();

  const highlightedCodes = countries.map((c) => c.code);
  const countryScores = countries.reduce(
    (acc, c) => {
      if (c.score !== undefined) acc[c.code] = c.score;
      return acc;
    },
    {} as { [code: string]: DemocraticScore },
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          {t('map.title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('map.description')}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <InteractiveMap
          highlightedCodes={highlightedCodes}
          countryScores={countryScores}
          minHeight="auto"
          height={400}
          center={[0, 0]}
        />
      </Box>
    </Container>
  );
};

export default HomeMapSection;
