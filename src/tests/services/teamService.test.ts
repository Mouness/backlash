import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('../../services/teamService');
import { teamService } from '../../services/teamService';
import { getDocs } from 'firebase/firestore';

// Mock Firebase
vi.mock('../../firebase', () => ({
  db: {},
  storage: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
}));

describe('teamService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches team members', async () => {
    const mockData = [{ id: '1', data: () => ({ name: 'Nesa' }) }];
    (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      docs: mockData,
    } as unknown);

    const result = await teamService.getTeamMembers();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nesa');
  });
});
