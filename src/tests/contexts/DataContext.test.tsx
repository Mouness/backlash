import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DataProvider, useData } from '../../contexts/DataContext';
import { countryService } from '../../services/countryService';
import { teamService } from '../../services/teamService';
import { publicationService } from '../../services/publicationService';

vi.unmock('../../services/countryService');
vi.unmock('../../services/teamService');
vi.unmock('../../services/publicationService');
vi.unmock('../../contexts/DataContext');

// Mock config
vi.mock('../../config', () => ({
  ENABLE_MOCKS: false,
}));

// Test Component
const TestComponent = () => {
  const { countries, teamMembers, publications, loadingCountries } = useData();
  if (loadingCountries) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="countries-count">{countries.length}</div>
      <div data-testid="team-count">{teamMembers.length}</div>
      <div data-testid="pub-count">{publications.length}</div>
    </div>
  );
};

import type { MockInstance } from 'vitest';

describe('DataContext', () => {
  let countrySpy: MockInstance;
  let teamSpy: MockInstance;
  let pubSpy: MockInstance;

  beforeEach(() => {
    // Spy on the real service objects
    countrySpy = vi.spyOn(countryService, 'getCountries').mockResolvedValue([]);
    teamSpy = vi.spyOn(teamService, 'getTeamMembers').mockResolvedValue([]);
    pubSpy = vi.spyOn(publicationService, 'getPublications').mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides initial empty state', async () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('countries-count')).toHaveTextContent('0');
    expect(screen.getByTestId('team-count')).toHaveTextContent('0');
    expect(screen.getByTestId('pub-count')).toHaveTextContent('0');
  });

  it('fetches and provides data on mount', async () => {
    const mockCountries = [{ id: '1', code: 'CAN', name: { en: 'Canada' }, score: 'HIGH' }];
    const mockTeam = [{ id: 't1', name: 'Member 1' }];
    const mockPubs = [{ id: 'p1', title: { en: 'Pub 1' } }];

    countrySpy.mockResolvedValue(mockCountries);
    teamSpy.mockResolvedValue(mockTeam);
    pubSpy.mockResolvedValue(mockPubs);

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('countries-count')).toHaveTextContent('1');
    });

    expect(screen.getByTestId('team-count')).toHaveTextContent('1');
    expect(screen.getByTestId('pub-count')).toHaveTextContent('1');

    expect(countryService.getCountries).toHaveBeenCalled();
    expect(teamService.getTeamMembers).toHaveBeenCalled();
    expect(publicationService.getPublications).toHaveBeenCalled();
  });
});
