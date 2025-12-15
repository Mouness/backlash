import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils/test-utils';
import Team from '../../pages/Team';
import { MOCK_TEAM } from '../../data/mockTeam'; // MOCK_TEAM is still used in defaultContext and mockGetTeamMembers

// Mock dependencies with hoisted variables to avoid ReferenceError
const mocks = vi.hoisted(() => ({
  useData: vi.fn(),
  useAuth: vi.fn(),
}));

vi.mock('../../config', () => ({
  ENABLE_MOCKS: true,
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: mocks.useAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../contexts/DataContext', () => ({
  useData: mocks.useData,
  DataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../services/teamService');


// Mock service implementations
const mockDeleteMember = vi.fn().mockResolvedValue(undefined);
const mockAddMember = vi.fn().mockResolvedValue(undefined);
const mockUpdateMember = vi.fn().mockResolvedValue(undefined);
const mockGetTeamMembers = vi.fn().mockResolvedValue(MOCK_TEAM);

vi.mock('../../services/teamService', () => ({
  teamService: {
    getTeamMembers: () => mockGetTeamMembers(),
    addTeamMember: (data: unknown) => mockAddMember(data),
    updateTeamMember: (id: string, data: unknown) => mockUpdateMember(id, data),
    deleteTeamMember: (id: string) => mockDeleteMember(id),
  },
}));

// Default team data
const defaultContext = {
  teamMembers: MOCK_TEAM.map((m, i) => ({ ...m, id: `mock-${i}` })),
  loadingTeam: false,
  refreshTeam: vi.fn(),
};

describe('Team Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTeamMembers.mockResolvedValue(MOCK_TEAM);
    mocks.useData.mockReturnValue(defaultContext);

    // Default auth state (logged out)
    mocks.useAuth.mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.spyOn(window, 'alert').mockImplementation(() => { });
  });

  it('renders seed button when empty/mock and calls seed logic', async () => {
    // Force empty state
    mocks.useData.mockReturnValue({
      ...defaultContext,
      teamMembers: [],
    });

    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Team />);
    const seedButton = screen.getByText('team.initialize_db');
    expect(seedButton).toBeInTheDocument();

    fireEvent.click(seedButton);
    expect(window.alert).toHaveBeenCalledWith('team.seed_start');

    await waitFor(() => {
      expect(mockGetTeamMembers).toHaveBeenCalled();
    });
  });

  it('renders page title and list of members', () => {
    // Default auth from beforeEach is null/logged out
    render(<Team />);
    expect(screen.getByText('nav.team')).toBeInTheDocument();
    expect(screen.getByText('Nesa Zimmermann')).toBeInTheDocument();
  });

  it('shows admin actions when logged in', () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Team />);
    expect(screen.getByText('team.add_member')).toBeInTheDocument();
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('hides admin actions when logged out', () => {
    mocks.useAuth.mockReturnValue({
      currentUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    render(<Team />);
    expect(screen.queryByText('team.add_member')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('completes add member flow', async () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Team />);
    const addButton = screen.getByText('team.add_member');
    fireEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('admin.team.title_new')).toBeInTheDocument();

    // Fill Name
    const nameInput = screen.getByTestId('team-name-input');
    fireEvent.change(nameInput, { target: { value: 'New Test Member' } });

    // Fill Email
    const emailInput = screen.getByTestId('team-email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Click Save
    const saveButton = screen.getByText('admin.common.save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockAddMember).toHaveBeenCalled();
      const calls = mockAddMember.mock.calls;
      const data = calls[0][0];
      expect(data.name).toBe('New Test Member');
      expect(data.email).toBe('test@example.com');
    });
  });

  it('completes edit member flow', async () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Team />);
    // Wait for list
    expect(screen.getByText('Nesa Zimmermann')).toBeInTheDocument();

    const editIcons = screen.getAllByTestId('EditIcon');
    const editBtn = editIcons[0].closest('button');
    fireEvent.click(editBtn!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check initial value
    const nameInput = screen.getByTestId('team-name-input');
    expect(nameInput).toHaveValue('Nesa Zimmermann');

    // Change Name
    fireEvent.change(nameInput, { target: { value: 'Edited Member Name' } });

    // Click Save
    const saveButton = screen.getByText('admin.common.save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateMember).toHaveBeenCalled();
      expect(mockUpdateMember).toHaveBeenCalledWith('mock-0', expect.objectContaining({
        name: 'Edited Member Name'
      }));
    });
  });

  it('completes delete member flow', async () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Team />);
    expect(screen.getByText('Nesa Zimmermann')).toBeInTheDocument();

    const deleteIcons = screen.getAllByTestId('DeleteIcon');
    const deleteBtn = deleteIcons[0].closest('button');
    fireEvent.click(deleteBtn!);

    // No window.confirm in Team page either? Checking logic... 
    // TeamCard calls onDelete. Team page handleDelete calls service.
    // Assuming same pattern as Publications (direct delete or alert on error).

    await waitFor(() => {
      expect(mockDeleteMember).toHaveBeenCalledWith('mock-0');
    });
  });
});
