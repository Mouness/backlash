import React from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../contexts/AuthContext';
import { useCountryController } from '../hooks/useCountryController';

import { ENABLE_MOCKS } from '../config';
import CountryCard from '../components/molecules/CountryCard';
import AdminCountryDialog from '../components/organisms/AdminCountryDialog';
import InteractiveMap from '../components/organisms/InteractiveMap';
import { DemocraticScore } from '../types/models';

const Countries: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const {
    countries,
    loading,
    dialogOpen,
    editingCountry,
    handleAddClick,
    handleEditClick,
    handleCloseDialog,
    handleDeleteClick,
    handleSeed,
    handleDialogSubmit,
  } = useCountryController();

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Map Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom color="primary">
            {t('map.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('map.description')}
          </Typography>
        </Box>
        <InteractiveMap
          highlightedCodes={countries.map((c) => c.code)}
          countryScores={countries.reduce(
            (acc, c) => {
              if (c.score !== undefined) acc[c.code] = c.score;
              return acc;
            },
            {} as { [code: string]: DemocraticScore },
          )}
          minHeight="auto"
          height={400}
          center={[0, 0]}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
            {t('countries.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('countries.description')}
          </Typography>
        </Box>
        <Box>
          {currentUser && (
            <Box>
              {ENABLE_MOCKS &&
                countries.length > 0 &&
                !countries.some((c) => c.id && c.id.length > 3) && (
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
              <CountryCard
                country={country}
                currentUser={currentUser}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AdminCountryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        initialData={editingCountry}
      />
    </Container>
  );
};

export default Countries;
