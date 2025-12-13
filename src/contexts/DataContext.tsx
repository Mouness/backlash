import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Generic Data Fetcher Helper
  const fetchAndMergeData = useCallback(
    async <T,>(
      fetcher: () => Promise<T[]>,
      type: 'country' | 'team' | 'publication',
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      loadingSetter: React.Dispatch<React.SetStateAction<boolean>>,
      errorMessage: string,
      sortFn?: (a: T, b: T) => number,
    ) => {
      loadingSetter(true);
      try {
        const dbData = await fetcher();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let finalData: any[] = dbData;

        if (ENABLE_MOCKS) {
          finalData = mergeDataByType(dbData, type) as T[];
        }

        if (sortFn) {
          finalData.sort(sortFn);
        }

        setter(finalData as T[]);
      } catch (error) {
        console.error(`Failed to fetch ${type} in DataContext`, error);
        setErrorSnackbar({ open: true, message: errorMessage });
        if (ENABLE_MOCKS) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setter(mergeDataByType([], type) as any[]);
        } else {
          setter([]);
        }
      } finally {
        loadingSetter(false);
      }
    },
    [],
  );

  const refreshCountries = useCallback(() => {
    return fetchAndMergeData(
      countryService.getCountries,
      'country',
      setCountries,
      setLoadingCountries,
      'Failed to fetch countries data.',
    );
  }, [fetchAndMergeData]);

  const refreshTeam = useCallback(() => {
    return fetchAndMergeData(
      teamService.getTeamMembers,
      'team',
      setTeamMembers,
      setLoadingTeam,
      'Failed to fetch team data.',
    );
  }, [fetchAndMergeData]);

  const refreshPublications = useCallback(() => {
    return fetchAndMergeData(
      publicationService.getPublications,
      'publication',
      setPublications,
      setLoadingPublications,
      'Failed to fetch publications data.',
      (a, b) => {
        const dateA = a.date?.toMillis() || 0;
        const dateB = b.date?.toMillis() || 0;
        return dateB - dateA;
      },
    );
  }, [fetchAndMergeData]);

  useEffect(() => {
    refreshCountries();
    refreshTeam();
    refreshPublications();
  }, [refreshCountries, refreshTeam, refreshPublications]);

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
