import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockProviders } from '../utils/test-utils';
import PublicationDetails from '../../pages/PublicationDetails';

describe('PublicationDetails Page', () => {
  it.skip('renders publication details', () => {
    render(
      <MemoryRouter initialEntries={['/publications/pub1']}>
        <MockProviders>
          <Routes>
            <Route path="/publications/:id" element={<PublicationDetails />} />
          </Routes>
        </MockProviders>
      </MemoryRouter>,
    );

    // Expect details for Test Pub (id: pub1)
    expect(screen.getByText('Test Pub')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('ARTICLE')).toBeInTheDocument();
  });
});
