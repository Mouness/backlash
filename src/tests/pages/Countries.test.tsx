import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Countries from '../../pages/Countries';

describe('Countries Page', () => {
  it('renders page title', () => {
    render(<Countries />);
    expect(screen.getByRole('heading', { name: 'countries.title' })).toBeInTheDocument();
  });

  it('renders list of countries', () => {
    render(<Countries />);
    // Expect Canada and Switzerland because they are in the setupTests mock
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Switzerland')).toBeInTheDocument();
  });
});
