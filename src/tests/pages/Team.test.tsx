import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils/test-utils';
import Team from '../../pages/Team';
import { MOCK_TEAM } from '../../data/mockTeam'; // MOCK_TEAM is still used in defaultContext and mockGetTeamMembers

// Mock dependencies with hoisted variables to avoid ReferenceError
const mocks = vi.hoisted(() => ({
  useData: vi.fn(),
  useAuth: vi.fn(),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: mocks.useAuth,
  AuthProvider: ({ children }: any) => <div>{children}</div>
}));

vi.mock('../../contexts/DataContext', () => ({
  useData: mocks.useData,
  DataProvider: ({ children }: any) => <div>{children}</div>
}));

vi.mock('../../services/teamService');
vi.mock('../../components/organisms/AdminTeamDialog', () => ({
  default: ({ open, onClose, onSave, initialData }: any) =>
    open ? (
      <div role="dialog">
        {initialData ? 'admin.team.title_edit' : 'admin.team.title_new'}
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSave({ name: 'New Member' })}>Save</button>
      </div>
    ) : null,
}));

// Mock service implementations
const mockDeleteMember = vi.fn().mockResolvedValue(undefined);
const mockAddMember = vi.fn().mockResolvedValue(undefined);
const mockUpdateMember = vi.fn().mockResolvedValue(undefined);
const mockGetTeamMembers = vi.fn().mockResolvedValue(MOCK_TEAM);

vi.mock('../../services/teamService', () => ({
  teamService: {
    getTeamMembers: () => mockGetTeamMembers(),
    addTeamMember: (data: any) => mockAddMember(data),
    updateTeamMember: (id: string, data: any) => mockUpdateMember(id, data),
    deleteTeamMember: (id: string) => mockDeleteMember(id),
  }
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
      logout: vi.fn()
    });

    vi.spyOn(window, 'alert').mockImplementation(() => { });
  });

  it('renders seed button when empty/mock and calls seed logic', async () => {
    // Force empty state
    mocks.useData.mockReturnValue({
      ...defaultContext,
      teamMembers: []
    });

    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
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
      logout: vi.fn()
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
      logout: vi.fn()
    });
    render(<Team />);
    expect(screen.queryByText('team.add_member')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('opens add dialog on click', async () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(<Team />);
    const addButton = screen.getByText('team.add_member');
    fireEvent.click(addButton);
    expect(screen.getByText('admin.team.title_new')).toBeInTheDocument();
  });

  it('calls delete service on click', async () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(<Team />);
    const deleteIcons = screen.getAllByTestId('DeleteIcon');
    const deleteBtn = deleteIcons[0].closest('button');

    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      await waitFor(() => {
        expect(mockDeleteMember).toHaveBeenCalled();
      });
    }
  });

  it('opens edit dialog on click', async () => {
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(<Team />);
    const editIcons = screen.getAllByTestId('EditIcon');
    const editBtn = editIcons[0].closest('button');

    if (editBtn) {
      fireEvent.click(editBtn);
      expect(screen.getByText('admin.team.title_edit')).toBeInTheDocument();
    }
  });

});
