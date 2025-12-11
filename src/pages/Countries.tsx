import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { countryService } from '../services/countryService';
import type { Country } from '../services/countryService';
import AdminCountryDialog from '../components/organisms/AdminCountryDialog';
import InteractiveMap from '../components/organisms/InteractiveMap';
import { useData } from '../contexts/DataContext';
import { MOCK_COUNTRIES } from '../data/mockCountries';

const Countries: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { countries, loadingCountries: loading, refreshCountries } = useData();
  const navigate = useNavigate();

  // Local state for dialog only
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const handleAddClick = () => {
    setEditingCountry(null);
    setDialogOpen(true);
  };

  const handleEditClick = (country: Country) => {
    setEditingCountry(country);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    // Direct execution - relying on UI/Permissions
    try {
      console.log('Deleting country:', id);
      await countryService.deleteCountry(id);
      await refreshCountries();
      // Optional: alert/toast here
    } catch (error) {
      console.error('Failed to delete country', error);
      alert('Error deleting country');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Initialize database with default countries?')) return;
    try {
      // Fetch fresh data to avoid stale state issues
      const currentDocs = await countryService.getCountries();
      const existingCodes = new Set(currentDocs.map((c) => c.code));

      let addedCount = 0;
      for (const mock of MOCK_COUNTRIES) {
        if (!existingCodes.has(mock.code)) {
          await countryService.addCountry(mock);
          addedCount++;
        }
      }

      await refreshCountries();
      if (addedCount > 0) {
        alert(`Successfully added ${addedCount} countries.`);
      } else {
        alert('Database is already up to date.');
      }
    } catch (error) {
      console.error('Error seeding countries:', error);
      alert(`Error seeding database: ${String(error)}`);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('Current Countries State:', countries);
  }, [countries]);

  const handleDialogSubmit = async (data: Omit<Country, 'id'>) => {
    try {
      if (editingCountry) {
        await countryService.updateCountry(editingCountry.id, data);
      } else {
        await countryService.addCountry(data);
      }
      refreshCountries();
    } catch (error) {
      console.error('Error saving country', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Map Section */}
      <Box sx={{ mb: 8 }}>
        <InteractiveMap
          highlightedCodes={countries.map((c) => c.code)}
          minHeight="auto"
          height={400}
          center={[0, 0]}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} color="primary.main">
          {t('countries.title')}
        </Typography>
        <Box>
          {currentUser && (
            <Box>
              {(countries.length < MOCK_COUNTRIES.length ||
                countries.some((c) => c.id === c.code)) && (
                <Button variant="outlined" color="warning" onClick={handleSeed} sx={{ mr: 2 }}>
                  {t('countries.initialize_db')}
                </Button>
              )}
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
                {t('countries.add_analysis')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {countries.map((country) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={country.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate(`/countries/${country.id}`)}
              >
                {country.imageUrl && (
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${country.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {country.name[currentLang] || country.name['en']}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {country.summary[currentLang] || country.summary['en']}
                  </Typography>
                </CardContent>
                {currentUser && (
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(country);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(country.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AdminCountryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        initialData={editingCountry}
      />
    </Container>
  );
};

export default Countries;
