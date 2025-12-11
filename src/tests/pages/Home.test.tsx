import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Home from '../../pages/Home';

describe('Home Page', () => {
  it('renders hero section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'home.hero.slide1.title' })).toBeInTheDocument();
  });

  it('renders team preview', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'home.team_preview.title' })).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument(); // Mock data
  });

  it('renders publications preview', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'nav.publications' })).toBeInTheDocument();
    expect(screen.getByText('Test Pub')).toBeInTheDocument(); // Mock data
  });
});
