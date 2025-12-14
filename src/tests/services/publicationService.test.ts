import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('../../services/publicationService');
import { publicationService } from '../../services/publicationService';
import {
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  type DocumentSnapshot,
} from 'firebase/firestore';

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
  limit: vi.fn(),
  startAfter: vi.fn(),
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
    expect(result.publications).toHaveLength(1);
    expect((result.publications[0].title as { en: string }).en).toBe('Pub 1');
    expect(query).toHaveBeenCalled();
    expect(orderBy).toHaveBeenCalledWith('date', 'desc');
    expect(limit).toHaveBeenCalledWith(10);
  });

  it('fetches next page with startAfter', async () => {
    const mockData = [{ id: '2', data: () => ({ title: { en: 'Pub 2' } }) }];
    (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      docs: mockData,
    } as unknown);

    const lastDoc = { id: '1' } as unknown as DocumentSnapshot;
    const result = await publicationService.getPublications(10, lastDoc);

    expect(result.publications).toHaveLength(1);
    expect(startAfter).toHaveBeenCalledWith(lastDoc);
    expect(limit).toHaveBeenCalledWith(10);
  });
});
