import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import Countries from '../../pages/Countries';
import { useAuth } from '../../contexts/AuthContext';

// Mock useAuth is handled in setupTests, we just override it
const mockLogin = vi.fn();
const mockLogout = vi.fn();

// Mock DB data
import { MOCK_COUNTRIES } from '../../data/mockCountries';

// Mock DataContext to allow overriding in tests
const mockUseData = vi.fn();
vi.mock('../../config', () => ({
  ENABLE_MOCKS: true,
}));
vi.mock('../../contexts/DataContext', () => ({
  useData: () => mockUseData(), // Return result of spy
  DataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock service methods
const mockGetCountries = vi.fn(); // Defined here to be captured
const mockDeleteCountry = vi.fn().mockResolvedValue(undefined);
const mockAddCountry = vi.fn().mockResolvedValue(undefined);
const mockUpdateCountry = vi.fn().mockResolvedValue(undefined);

vi.mock('../../services/countryService', async () => {
  return {
    countryService: {
      getCountries: () => mockGetCountries(),
      addCountry: (data: unknown) => mockAddCountry(data),
      updateCountry: (id: string, data: unknown) => mockUpdateCountry(id, data),
      deleteCountry: (id: string) => mockDeleteCountry(id),
    },
  };
});

// Default countries data
const defaultContext = {
  countries: MOCK_COUNTRIES.map((c) => ({ ...c, id: c.code })), // Add IDs as in DataContext
  loadingCountries: false,
  refreshCountries: vi.fn(),
};

describe('Countries Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on service methods
    mockGetCountries.mockResolvedValue(MOCK_COUNTRIES);
    mockUseData.mockReturnValue(defaultContext);

    // Mock window.confirm and alert
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => { });

    // Mock getScoreLevel to avoid strict i18n key dependency?
    // Or just expect translation keys. The component uses t(key).
    // In tests t(key) -> key.
    // So we expect 'admin.country.score_levels.very_high' or similar.
  });

  it('renders page title and list of countries (Guest)', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: null,
      loading: false,
      login: mockLogin,
      logout: mockLogout,
    });
    render(<Countries />);
    expect(screen.getByText('countries.title')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    // Check score is displayed (mock Canada has score 85 -> Very High)
    // The util returns 'admin.country.score_levels.very_high'
    // t('admin.country.score_levels.very_high') -> 'admin.country.score_levels.very_high'
    expect(screen.getAllByText('admin.country.score_levels.very_high').length).toBeGreaterThan(0);
    expect(screen.queryByText('countries.add_analysis')).not.toBeInTheDocument();
  });

  it('shows admin actions and seed button when empty/mocked and logged in', async () => {
    // Force empty state to show Seed button (logic: < MOCK_COUNTRIES.length or matches ID code)
    // MOCK_COUNTRIES usually length 2.
    // If we return empty list, it should show seed button.
    mockUseData.mockReturnValue({
      ...defaultContext,
      // countries must be populated (mocks) for seed button to show under new logic
    });

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: mockLogin,
      logout: mockLogout,
    });

    render(<Countries />);
    expect(screen.getByText('countries.add_analysis')).toBeInTheDocument();

    const seedButton = screen.getByText('countries.initialize_db');
    expect(seedButton).toBeInTheDocument();

    // Force getCountries to return empty so seed adds them
    mockGetCountries.mockResolvedValue([]);

    // Click seed
    fireEvent.click(seedButton);
    expect(window.confirm).toHaveBeenCalled();

    // Wait for service call
    await waitFor(() => {
      expect(mockGetCountries).toHaveBeenCalled();
      // Should add countries
      expect(mockAddCountry).toHaveBeenCalled();
    });
  });

  it('completes add country flow', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: mockLogin,
      logout: mockLogout,
    });

    render(<Countries />);
    const addButton = screen.getByText('countries.add_analysis');
    fireEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Fill Code
    const codeInput = screen.getByTestId('country-code-input');
    fireEvent.change(codeInput, { target: { value: 'TEST' } });

    // Click Save
    const saveButton = screen.getByText('admin.common.save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockAddCountry).toHaveBeenCalled();
      const calls = mockAddCountry.mock.calls;
      const data = calls[0][0];
      expect(data.code).toBe('TEST');
    });
  });

  it('completes edit country flow', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: mockLogin,
      logout: mockLogout,
    });

    render(<Countries />);
    expect(screen.getByText('Canada')).toBeInTheDocument();

    const editIcons = screen.getAllByTestId('EditIcon');
    const editBtn = editIcons[0].closest('button');
    fireEvent.click(editBtn!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check initial value (CA or similar)
    const codeInput = screen.getByTestId('country-code-input');
    // MOCK_COUNTRIES Canada code is likely 'CA' or 'can'
    // Let's assume 'CA' based on common mocks. If fails, we check mock values.

    // Change Code
    fireEvent.change(codeInput, { target: { value: 'EDITED' } });

    // Click Save
    const saveButton = screen.getByText('admin.common.save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateCountry).toHaveBeenCalled();
      // args: (id, data). ID of Canada mock?
      // defaultContext maps id to code. MOCK_COUNTRIES[0] is Canada.
      // If mock has code 'ca', id is 'ca'. 
      // We will check call content roughly or strict if known.
      const calls = mockUpdateCountry.mock.calls;
      expect(calls[0][1].code).toBe('EDITED');
    });
  });

  it('completes delete country flow', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: mockLogin,
      logout: mockLogout,
    });

    render(<Countries />);
    expect(screen.getByText('Canada')).toBeInTheDocument();

    const deleteIcons = screen.getAllByTestId('DeleteIcon');
    const deleteBtn = deleteIcons[0].closest('button');
    fireEvent.click(deleteBtn!);

    // Confirm is not used in this flow
    // expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockDeleteCountry).toHaveBeenCalled();
    });
  });
});
