import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('../../services/publicationService');
import { publicationService } from '../../services/publicationService';
import { getDocs, orderBy, query } from 'firebase/firestore';

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
  Timestamp: { now: () => ({ toDate: () => new Date() }) },
}));

describe('publicationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches publications sorted by date', async () => {
    const mockData = [{ id: '1', data: () => ({ title: { en: 'Pub 1' } }) }];
    (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      docs: mockData,
    } as unknown);

    const result = await publicationService.getPublications();
    expect(result).toHaveLength(1);
    expect((result[0].title as { en: string }).en).toBe('Pub 1');
    expect(query).toHaveBeenCalled();
    expect(orderBy).toHaveBeenCalledWith('date', 'desc');
  });
});
