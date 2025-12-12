import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '../utils/test-utils';
import MainLayout from '../../components/templates/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

// Mock useAuth is global
const mockLogout = vi.fn();

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default safe mock
    (useAuth as any).mockReturnValue({
      currentUser: null,
      loading: false,
      logout: mockLogout,
    });
  });

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

  it('shows login button when guest', () => {
    (useAuth as any).mockReturnValue({
      currentUser: null,
      loading: false,
      logout: mockLogout,
    });

    render(
      <MainLayout>
        <div>Child</div>
      </MainLayout>,
    );
    const loginBtns = screen.getAllByText('nav.login');
    expect(loginBtns.length).toBeGreaterThan(0);
  });

  it('shows admin badge and logout when logged in', () => {
    (useAuth as any).mockReturnValue({
      currentUser: { uid: '123' },
      loading: false,
      logout: mockLogout,
    });

    render(
      <MainLayout>
        <div>Child</div>
      </MainLayout>,
    );
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('nav.logout')).toBeInTheDocument();
  });

  it('opens language menu and changes language', async () => {
    render(
      <MainLayout>
        <div>Child</div>
      </MainLayout>,
    );

    // Find language button (it has title 'languages.change_language')
    // Note: The title attribute is used in the IconButton in Header.tsx
    const langBtn = screen.getByTitle('languages.change_language');
    fireEvent.click(langBtn);

    // Menu should open
    const frOption = screen.getByText('languages.fr');
    expect(frOption).toBeInTheDocument();

    // Click option
    fireEvent.click(frOption);
  });
});
