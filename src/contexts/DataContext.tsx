import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { DocumentSnapshot } from 'firebase/firestore';
import { countryService } from '../services/countryService';
import type { Country } from '../types/models';
import { teamService } from '../services/teamService';
import type { TeamMember } from '../types/models';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../types/models';
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
  loadMorePublications: () => Promise<void>;
  hasMorePubs: boolean;
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
  const [lastPubDoc, setLastPubDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMorePubs, setHasMorePubs] = useState(true);

  const [errorSnackbar, setErrorSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleCloseSnackbar = () => {
    setErrorSnackbar({ ...errorSnackbar, open: false });
  };

  // Generic Data Fetcher Helper (for Country and Team)
  const fetchAndMergeData = useCallback(
    async <T,>(
      fetcher: () => Promise<T[]>,
      type: 'country' | 'team',
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

  // Specific Publication Fetcher with Pagination
  const refreshPublications = useCallback(async () => {
    setLoadingPublications(true);
    try {
      // Fetch first page (limit 5)
      const { publications: dbPubs, lastDoc } = await publicationService.getPublications(5, null);

      let finalPubs: Publication[] = dbPubs;

      if (ENABLE_MOCKS) {
        // Merge with mocks if enabled, though pagination + mocks is tricky.
        // For simplicity, we merge initial load with mocks and treat it as base.
        // Infinite scroll will only fetch from DB.
        finalPubs = mergeDataByType(dbPubs, 'publication') as Publication[];
      }

      // Sort desc date
      finalPubs.sort((a, b) => {
        const dateA = a.date?.toMillis() || 0;
        const dateB = b.date?.toMillis() || 0;
        return dateB - dateA;
      });

      setPublications(finalPubs);
      setLastPubDoc(lastDoc);
      setHasMorePubs(!!lastDoc);
    } catch (error) {
      console.error('Failed to fetch publications:', error);
      setErrorSnackbar({ open: true, message: 'Failed to fetch publications.' });
      if (ENABLE_MOCKS) {
        setPublications(mergeDataByType([], 'publication') as Publication[]);
      } else {
        setPublications([]);
      }
    } finally {
      setLoadingPublications(false);
    }
  }, []);

  const loadMorePublications = useCallback(async () => {
    if (!lastPubDoc) return;

    try {
      const { publications: newPubs, lastDoc } = await publicationService.getPublications(
        10,
        lastPubDoc,
      );

      if (newPubs.length > 0) {
        setPublications((prev) => [...prev, ...newPubs]);
        setLastPubDoc(lastDoc);
        setHasMorePubs(!!lastDoc);
      } else {
        setHasMorePubs(false);
      }
    } catch (error) {
      console.error('Failed to load more publications:', error);
      setErrorSnackbar({ open: true, message: 'Failed to load more publications.' });
    }
  }, [lastPubDoc]);

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
        loadMorePublications,
        hasMorePubs,
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
