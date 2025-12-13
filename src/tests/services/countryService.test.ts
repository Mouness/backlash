import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('../../services/countryService');
import { countryService } from '../../services/countryService';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('../../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  query: vi.fn(),
}));

describe('countryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches countries', async () => {
    const mockData = [{ id: '1', data: () => ({ code: 'CAN', name: { en: 'Canada' } }) }];
    const mockSnapshot = {
      docs: mockData,
    };
    (getDocs as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockSnapshot);

    const result = await countryService.getCountries();
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('CAN');
    expect(collection).toHaveBeenCalledWith(db, 'countries');
  });

  it('adds a country', async () => {
    (addDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'new-id' });
    const newCountry = { code: 'USA', name: { en: 'USA' } };

    await countryService.addCountry(
      newCountry as unknown as Parameters<typeof countryService.addCountry>[0],
    );
    expect(addDoc).toHaveBeenCalled();
  });

  it('updates a country', async () => {
    (doc as unknown as ReturnType<typeof vi.fn>).mockReturnValue('doc-ref');
    await countryService.updateCountry('1', { score: 'HIGH' });
    expect(updateDoc).toHaveBeenCalledWith('doc-ref', { score: 'HIGH' });
  });

  it('deletes a country', async () => {
    (doc as unknown as ReturnType<typeof vi.fn>).mockReturnValue('doc-ref');
    await countryService.deleteCountry('1');
    expect(deleteDoc).toHaveBeenCalledWith('doc-ref');
  });
});
