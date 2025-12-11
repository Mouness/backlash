import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { countryService } from '../services/countryService';
import type { Country } from '../services/countryService';
import { MOCK_COUNTRIES } from '../data/mockCountries';
import { teamService } from '../services/teamService';
import type { TeamMember } from '../services/teamService';
import { MOCK_TEAM } from '../data/mockTeam';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../services/publicationService';
import { MOCK_PUBLICATIONS } from '../data/mockPublications';

interface DataContextType {
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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Countries State
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Team State
  // Initialize with mock data to avoid empty flash if desired, or empty array
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM as TeamMember[]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Publications State
  const [publications, setPublications] = useState<Publication[]>(
    MOCK_PUBLICATIONS as Publication[],
  );
  const [loadingPublications, setLoadingPublications] = useState(true);

  const refreshCountries = async () => {
    setLoadingCountries(true);
    try {
      const data = await countryService.getCountries();
      if (data && data.length > 0) {
        setCountries(data);
      } else {
        // Fallback to mocks with generated IDs
        const mocksWithIds = MOCK_COUNTRIES.map((c) => ({ ...c, id: c.code })) as Country[];
        setCountries(mocksWithIds);
      }
    } catch (error) {
      console.error('Failed to fetch countries in DataContext', error);
      // Fallback to mocks on error too
      const mocksWithIds = MOCK_COUNTRIES.map((c) => ({ ...c, id: c.code })) as Country[];
      setCountries(mocksWithIds);
    } finally {
      setLoadingCountries(false);
    }
  };

  const refreshTeam = async () => {
    setLoadingTeam(true);
    try {
      const data = await teamService.getTeamMembers();
      if (data && data.length > 0) {
        setTeamMembers(data);
      } else {
        setTeamMembers(MOCK_TEAM as TeamMember[]);
      }
    } catch (error) {
      console.error('Failed to fetch team in DataContext', error);
      setTeamMembers(MOCK_TEAM as TeamMember[]);
    } finally {
      setLoadingTeam(false);
    }
  };

  const refreshPublications = async () => {
    setLoadingPublications(true);
    try {
      const data = await publicationService.getPublications();
      if (data && data.length > 0) {
        setPublications(data);
      } else {
        setPublications(MOCK_PUBLICATIONS as Publication[]);
      }
    } catch (error) {
      console.error('Failed to fetch publications in DataContext', error);
      setPublications(MOCK_PUBLICATIONS as Publication[]);
    } finally {
      setLoadingPublications(false);
    }
  };

  useEffect(() => {
    refreshCountries();
    refreshTeam();
    refreshPublications();
  }, []);

  const value = {
    countries,
    loadingCountries,
    refreshCountries,
    teamMembers,
    loadingTeam,
    refreshTeam,
    publications,
    loadingPublications,
    refreshPublications,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
