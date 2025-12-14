import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import Publications from '../../pages/Publications';
// Mock useAuth is handled in setupTests
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_PUBLICATIONS } from '../../data/mockPublications';

// Mock service
const mockDeletePublication = vi.fn().mockResolvedValue(undefined);
const mockAddPublication = vi.fn().mockResolvedValue(undefined);
const mockUpdatePublication = vi.fn().mockResolvedValue(undefined);
const mockGetPublications = vi
  .fn()
  .mockResolvedValue({ publications: MOCK_PUBLICATIONS, lastDoc: null });

vi.mock('../../services/publicationService', () => ({
  publicationService: {
    getPublications: () => mockGetPublications(),
    addPublication: (data: unknown) => mockAddPublication(data),
    updatePublication: (id: string, data: unknown) => mockUpdatePublication(id, data),
    deletePublication: (id: string) => mockDeletePublication(id),
  },
}));

// Define mock using vi.hoisted to ensure accessibility in vi.mock factory
const { mockUseData } = vi.hoisted(() => {
  return { mockUseData: vi.fn() };
});

vi.mock('../../config', () => ({
  ENABLE_MOCKS: true,
}));

vi.mock('../../contexts/DataContext', () => ({
  useData: mockUseData, // Pass the mock function directly if it returns the hook result, or wrapping it
  DataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Default data
const defaultContext = {
  publications: [
    {
      id: 'pub1',
      title: { en: 'Test Pub' },
      description: { en: 'Desc' },
      category: 'article',
      imageUrl: 'url',
      date: new Date('2024-01-01'), // toDate() simulated? No, Component calls .toDate().
      link: 'http://test.com',
    },
  ],
  loadingPublications: false,
  refreshPublications: vi.fn(),
  loadMorePublications: vi.fn(),
  hasMorePubs: false,
  // Add other missing properties to satisfy Typescript/Context
  countries: [],
  loadingCountries: false,
  refreshCountries: vi.fn(),
  teamMembers: [],
  loadingTeam: false,
  refreshTeam: vi.fn(),
};

// Fix date mock to have toDate

defaultContext.publications[0].date = {
  toDate: () => new Date('2024-01-01'),
  seconds: 1234567890,
  nanoseconds: 0,
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Mock useAuth is handled in setupTests

describe('Publications Page', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).IntersectionObserver = class {
      constructor() {}
      observe() {
        return null;
      }
      unobserve() {
        return null;
      }
      disconnect() {
        return null;
      }
    };

    vi.clearAllMocks();
    mockGetPublications.mockResolvedValue({ publications: MOCK_PUBLICATIONS, lastDoc: null });
    mockUseData.mockReturnValue(defaultContext);
    // Spy on alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders seed button when empty and calls seed logic', async () => {
    // Mock empty data
    mockUseData.mockReturnValue({
      ...defaultContext,
      publications: [],
    });

    vi.mocked(useAuth).mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Publications />);
    const seedButton = screen.getByText('publications.initialize_db');
    expect(seedButton).toBeInTheDocument();

    fireEvent.click(seedButton);
    expect(window.alert).toHaveBeenCalledWith('publications.seed_start');

    // It calls publicationService.getPublications() then addPublication loops
    await waitFor(() => {
      expect(mockGetPublications).toHaveBeenCalled(); // to check existing
      // MOCK_PUBLICATIONS has items. If mockGet returns empty, it adds all.
      // mockGetPublications mocked to return MOCK_PUBLICATIONS in beforeEach.
      // If getPublications returns MOCK_PUBLICATIONS, then "existingTitles" has them all.
      // So it won't add any.
    });
  });

  it('renders correctly with no data message', () => {
    mockUseData.mockReturnValue({
      ...defaultContext,
      publications: [],
    });
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ currentUser: null });
    render(<Publications />);
    expect(screen.getByText('publications.no_data')).toBeInTheDocument();
  });

  it('renders page title and list of publications', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Publications />);
    expect(screen.getByText('nav.publications')).toBeInTheDocument();
    // DataContext mock in setupTests returns 'Test Pub'
    expect(screen.getByText('Test Pub')).toBeInTheDocument();
  });

  it('shows admin actions when logged in', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Publications />);
    expect(screen.getByText('publications.add_post')).toBeInTheDocument();
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('hides admin actions when logged out', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Publications />);
    expect(screen.queryByText('publications.add_post')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('opens add dialog on click', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Publications />);
    const addButton = screen.getByText('publications.add_post');
    fireEvent.click(addButton);
    // Expect dialog title. Often 'Add Publication' or 'New Publication'
    // In AdminPublicationDialog, it's typically 'New Publication' or similar hardcoded string
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('admin.publication.title_new')).toBeInTheDocument();
  });

  it('calls delete service on click', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Publications />);
    const deleteIcons = screen.getAllByTestId('DeleteIcon');
    const deleteBtn = deleteIcons[0].closest('button');

    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      await waitFor(() => {
        expect(mockDeletePublication).toHaveBeenCalled();
      });
    }
  });

  it('opens edit dialog on click', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Publications />);
    const editIcons = screen.getAllByTestId('EditIcon');
    const editBtn = editIcons[0].closest('button');

    if (editBtn) {
      fireEvent.click(editBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }
  });
});
