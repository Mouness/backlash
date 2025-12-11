import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Team from '../../pages/Team';

describe('Team Page', () => {
  it('renders page title', () => {
    render(<Team />);
    expect(screen.getByRole('heading', { level: 3, name: 'nav.team' })).toBeInTheDocument();
  });

  it('renders team members from context', () => {
    render(<Team />);
    const members = screen.getAllByText('Dr. Jane Doe');
    expect(members.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Researcher').length).toBeGreaterThan(0);
  });
});
