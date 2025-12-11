import { describe, it, expect } from 'vitest';
import { render, screen, within } from '../utils/test-utils';
import MainLayout from '../../components/templates/MainLayout';

describe('MainLayout', () => {
  it('renders navbar and footer', () => {
    render(
      <MainLayout>
        <div>Child Content</div>
      </MainLayout>,
    );

    // Navbar Check (Logo/Brand Name)
    expect(screen.getByText('brand.name')).toBeInTheDocument();

    // Footer Check
    const footer = screen.getByRole('contentinfo');
    const contactLink = within(footer).getByText('nav.contact');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
