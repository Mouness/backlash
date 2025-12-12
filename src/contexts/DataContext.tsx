import React, { createContext, useContext, useState, useEffect } from 'react';
import { countryService } from '../services/countryService';
import type { Country } from '../services/countryService';
import { teamService } from '../services/teamService';
import type { TeamMember } from '../services/teamService';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../services/publicationService';
import { mergeDataByType } from '../utils/dataUtils';
import { Snackbar, Alert } from '@mui/material';
import { ENABLE_MOCKS } from '../config';

interface DataContextProps {
  countries: Country[];
  loadingCountries: boolean;
  refreshCountries: () => Promise<void>;
  teamMembers: TeamMember[];
  loadingTeam: boolean;
  refreshTeam: () => Promise<void>;
  publications: Publication[];
  loadingPublications: boolean;
  refreshPublications: () => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Countries State
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Team State
  // Initialize with mock data to avoid empty flash if desired, or empty array
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Publications State
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);

  const [errorSnackbar, setErrorSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleCloseSnackbar = () => {
    setErrorSnackbar({ ...errorSnackbar, open: false });
  };

  const refreshCountries = async () => {
    setLoadingCountries(true);
    try {
      const dbData = await countryService.getCountries();
      let finalData = dbData;

      if (ENABLE_MOCKS) {
        finalData = mergeDataByType(dbData, 'country') as Country[];
      }

      setCountries(finalData);
    } catch (error) {
      console.error('Failed to fetch countries in DataContext', error);
      setErrorSnackbar({ open: true, message: 'Failed to fetch countries data.' });
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  };

  const refreshTeam = async () => {
    setLoadingTeam(true);
    try {
      const dbData = await teamService.getTeamMembers();
      let finalData = dbData;

      if (ENABLE_MOCKS) {
        finalData = mergeDataByType(dbData, 'team') as TeamMember[];
      }

      setTeamMembers(finalData);
    } catch (error) {
      console.error('Failed to fetch team in DataContext', error);
      setErrorSnackbar({ open: true, message: 'Failed to fetch team data.' });
      setTeamMembers([]);
    } finally {
      setLoadingTeam(false);
    }
  };

  const refreshPublications = async () => {
    setLoadingPublications(true);
    try {
      const dbData = await publicationService.getPublications();
      let finalData = dbData;

      if (ENABLE_MOCKS) {
        finalData = mergeDataByType(dbData, 'publication') as Publication[];
      }

      finalData.sort((a, b) => {
        const dateA = a.date?.toMillis() || 0;
        const dateB = b.date?.toMillis() || 0;
        return dateB - dateA;
      });

      setPublications(finalData);
    } catch (error) {
      console.error('Failed to fetch publications in DataContext', error);
      setErrorSnackbar({ open: true, message: 'Failed to fetch publications data.' });
      setPublications([]);
    } finally {
      setLoadingPublications(false);
    }
  };

  useEffect(() => {
    refreshCountries();
    refreshTeam();
    refreshPublications();
  }, []);

  return (
    <DataContext.Provider
      value={{
        countries,
        loadingCountries,
        refreshCountries,
        teamMembers,
        loadingTeam,
        refreshTeam,
        publications,
        loadingPublications,
        refreshPublications,
      }}
    >
      {children}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </DataContext.Provider>
  );
};
