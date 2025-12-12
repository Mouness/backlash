import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Chip, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { countryService } from '../services/countryService';
import { getScoreLevel } from '../utils/scoreUtils';
import AdminCountryDialog from '../components/organisms/AdminCountryDialog';
import type { Country } from '../services/countryService';
import ReactMarkdown from 'react-markdown';

const CountryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { countries, loadingCountries, refreshCountries } = useData();
  const { currentUser } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const country =
    id && countries.length > 0
      ? countries.find((c) => c.id === id || c.code.toUpperCase() === id.toUpperCase()) || null
      : null;

  const handleUpdate = async (data: Omit<Country, 'id'>) => {
    if (!country) return;
    try {
      await countryService.updateCountry(country.id, data);
      await refreshCountries();
    } catch (error) {
      console.error('Failed to update country', error);
      alert('Failed to update country');
    }
  };

  const handleDelete = async () => {
    if (!country) return;
    if (!window.confirm(t('admin.common.confirm_delete'))) return;
    try {
      await countryService.deleteCountry(country.id);
      await refreshCountries();
      navigate('/countries');
    } catch (error) {
      console.error('Failed to delete country', error);
      alert('Failed to delete country');
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/countries')}>
          Back to Countries
        </Button>
        {currentUser && (
          <Box>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              {t('admin.common.edit')}
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              {t('admin.common.delete')}
            </Button>
          </Box>
        )}
      </Box>

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

      {country.score !== undefined && (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            {i18n.t('countries.score_label')}:
          </Typography>
          <Chip
            label={i18n.t(getScoreLevel(country.score).key)}
            color={getScoreLevel(country.score).color}
            sx={{
              fontSize: '1rem',
              height: 32,
              px: 1,
              fontWeight: 'bold',
              ...getScoreLevel(country.score).style,
            }}
          />
        </Stack>
      )}

      {country.documentUrl && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            href={country.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<ArticleIcon />}
          >
            {i18n.t('countries.download_analysis')}
          </Button>
        </Box>
      )}

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
          '& p': { mb: 2 },
          fontSize: '1.1rem',
          lineHeight: 1.8,
        }}
      >
        <ReactMarkdown>
          {country.content ? country.content[currentLang] || country.content['en'] : ''}
        </ReactMarkdown>
      </Box>

      <AdminCountryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleUpdate}
        initialData={country}
      />
    </Container>
  );
};

export default CountryDetails;
