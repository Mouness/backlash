import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockProviders } from '../utils/test-utils';
import TeamDetails from '../../pages/TeamDetails';

describe('TeamDetails Page', () => {
  it('renders team member details', () => {
    render(
      <MemoryRouter initialEntries={['/team/1']}>
        <MockProviders>
          <Routes>
            <Route path="/team/:id" element={<TeamDetails />} />
          </Routes>
        </MockProviders>
      </MemoryRouter>,
    );

    // Expect name and role from mock data (Id 1 is Dr. Jane Doe)
    expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Researcher')).toBeInTheDocument();
    expect(screen.getByText('Bio')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
  });
});
