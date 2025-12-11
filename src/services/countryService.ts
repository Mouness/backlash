import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface LocalizedContent {
  en: string;
  fr: string;
  de: string;
}

export interface Country {
  id: string;
  code: string; // ISO code or ID used for map matching (e.g. CAN, CHE)
  name: LocalizedContent;
  summary: LocalizedContent;
  content: LocalizedContent; // Detailed analysis
  imageUrl?: string;
}

const COLLECTION_NAME = 'countries';

export const countryService = {
  getCountries: async (): Promise<Country[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('code'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as Country,
      );
    } catch (error) {
      console.error('Error getting countries:', error);
      throw error;
    }
  },

  getCountry: async (id: string): Promise<Country | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Country;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting country:', error);
      throw error;
    }
  },

  getCountryByCode: async (code: string): Promise<Country | null> => {
    try {
      // Note: In a real app with many docs, use a query.
      // For a few countries, filtering in memory or client-side might be acceptable if list is cached,
      // but let's query properly if possible. Ideally 'code' should be unique.
      // For simplicity here, if we don't index 'code', we might fetch all.
      // Let's assume we can query. Or simpler: fetch all and find.
      // Since there are only ~6 countries, fetching all is efficient enough.
      const all = await countryService.getCountries();
      return all.find((c) => c.code === code) || null;
    } catch (error) {
      console.error('Error getting country by code:', error);
      throw error;
    }
  },

  addCountry: async (country: Omit<Country, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), country);
      return docRef.id;
    } catch (error) {
      console.error('Error adding country:', error);
      throw error;
    }
  },

  updateCountry: async (id: string, country: Partial<Country>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...data } = country as Country; // Ensure ID is not in data
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating country:', error);
      throw error;
    }
  },

  deleteCountry: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting country:', error);
      throw error;
    }
  },
};
