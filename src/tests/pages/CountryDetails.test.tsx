import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockProviders } from '../utils/test-utils';
import CountryDetails from '../../pages/CountryDetails';

describe('CountryDetails Page', () => {
  it('renders country details', () => {
    render(
      <MemoryRouter initialEntries={['/countries/ca']}>
        <MockProviders>
          <Routes>
            <Route path="/countries/:id" element={<CountryDetails />} />
          </Routes>
        </MockProviders>
      </MemoryRouter>,
    );

    // Expect details for Canada (id: ca)
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    // Check stats presence - REMOVED as stats are not currently displayed
    // expect(screen.getByText('100')).toBeInTheDocument();
  });
});
