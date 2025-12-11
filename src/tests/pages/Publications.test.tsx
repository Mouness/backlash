import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Publications from '../../pages/Publications';

describe('Publications Page', () => {
  it('renders page title', () => {
    render(<Publications />);
    // Note: publications page uses h3 for title in mock implementation or setup?
    // Let's stick to name check which is safer
    expect(screen.getByRole('heading', { name: 'nav.publications' })).toBeInTheDocument();
  });

  it('renders publications list', () => {
    render(<Publications />);
    expect(screen.getByText('Test Pub')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});
