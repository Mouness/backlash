import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
// import type { Country } from '../services/countryService';

const CountryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { countries, loadingCountries } = useData();

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const country =
    id && countries.length > 0
      ? countries.find((c) => c.id === id || c.code.toUpperCase() === id.toUpperCase()) || null
      : null;

  if (loadingCountries) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!country) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">Country analysis not found ({id}).</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/countries')} sx={{ mt: 2 }}>
          Back to Countries
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/countries')} sx={{ mb: 4 }}>
        Back to Countries
      </Button>

      {country.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 200, md: 400 },
            borderRadius: 4,
            backgroundImage: `url(${country.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
            boxShadow: 3,
          }}
        />
      )}

      <Typography variant="h2" fontWeight={700} gutterBottom color="primary.main">
        {country.name[currentLang] || country.name['en']}
      </Typography>

      <Typography
        variant="h5"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 4, fontStyle: 'italic' }}
      >
        {country.summary[currentLang] || country.summary['en']}
      </Typography>

      <Box
        sx={{
          typography: 'body1',
          whiteSpace: 'pre-wrap',
          fontSize: '1.1rem',
          lineHeight: 1.8,
          '& p': { mb: 2 },
        }}
      >
        {/* 
                   In a real app, we might use a Markdown renderer here. 
                   For now, we display plain text with preserved whitespace.
                */}
        {country.content ? country.content[currentLang] || country.content['en'] : ''}
      </Box>
    </Container>
  );
};

export default CountryDetails;
