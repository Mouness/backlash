import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProviders } from '../utils/test-utils';
import SearchPage from '../../pages/SearchPage';

// SearchPage uses useData for content.

describe('SearchPage', () => {
    it('displays results based on query param', async () => {
        // Canada is in mock data
        render(
            <MemoryRouter initialEntries={['/search?q=Canada']}>
                <MockProviders>
                    <SearchPage />
                </MockProviders>
            </MemoryRouter>
        );

        // Should display query in title (mock returns key)
        expect(screen.getByText(/search.results_title/i)).toBeInTheDocument();

        // Should find Canada in results
        expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    it('shows no results message', () => {
        render(
            <MemoryRouter initialEntries={['/search?q=NonExistent']}>
                <MockProviders>
                    <SearchPage />
                </MockProviders>
            </MemoryRouter>
        );
        expect(screen.getByText(/search.no_results/i)).toBeInTheDocument();
    });
});
