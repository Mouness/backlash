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
const mockGetPublications = vi.fn().mockResolvedValue(MOCK_PUBLICATIONS);

vi.mock('../../services/publicationService', () => ({
  publicationService: {
    getPublications: () => mockGetPublications(),
    addPublication: (data: any) => mockAddPublication(data),
    updatePublication: (id: string, data: any) => mockUpdatePublication(id, data),
    deletePublication: (id: string) => mockDeletePublication(id),
  }
}));

// Mock DataContext to allow overriding in tests
const mockUseData = vi.fn();
vi.mock('../../contexts/DataContext', () => ({
  useData: () => mockUseData(), // Return result of spy
  DataProvider: ({ children }: any) => <div>{children}</div>
}));

// Default data
const defaultContext = {
  publications: [{
    id: 'pub1',
    title: { en: 'Test Pub' },
    description: { en: 'Desc' },
    category: 'article',
    imageUrl: 'url',
    date: {
      seconds: 123,
      toDate: () => new Date('2024-01-01'),
    },
    link: 'http://test.com'
  }],
  loadingPublications: false,
  refreshPublications: vi.fn(),
};

// Mock useAuth is handled in setupTests

describe('Publications Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPublications.mockResolvedValue(MOCK_PUBLICATIONS);
    mockUseData.mockReturnValue(defaultContext);
    // Spy on alert
    vi.spyOn(window, 'alert').mockImplementation(() => { });
  });

  it('renders seed button when empty and calls seed logic', async () => {
    // Mock empty data
    mockUseData.mockReturnValue({
      ...defaultContext,
      publications: []
    });

    (useAuth as any).mockReturnValue({
      currentUser: null, // Seed visible even for guests? No, code says button variant="outlined" ... wait it is inside Box, does it depend on auth? Checking source: No, depends on list length.
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
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
      publications: []
    });
    (useAuth as any).mockReturnValue({ currentUser: null });
    render(<Publications />);
    expect(screen.getByText('publications.no_data')).toBeInTheDocument();
  });

  it('renders page title and list of publications', () => {
    (useAuth as any).mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(<Publications />);
    expect(screen.getByText('nav.publications')).toBeInTheDocument();
    // DataContext mock in setupTests returns 'Test Pub'
    expect(screen.getByText('Test Pub')).toBeInTheDocument();
  });

  it('shows admin actions when logged in', () => {
    (useAuth as any).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(<Publications />);
    expect(screen.getByText('publications.add_post')).toBeInTheDocument();
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('hides admin actions when logged out', () => {
    (useAuth as any).mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(<Publications />);
    expect(screen.queryByText('publications.add_post')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('opens add dialog on click', async () => {
    (useAuth as any).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
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
    (useAuth as any).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
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
    (useAuth as any).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
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
