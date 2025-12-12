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
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

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
  documentUrl?: string; // URL to PDF/DOC analysis
  score?: number; // 0-100 indicating democratic resilience/backlash status
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

      const q = query(collection(db, COLLECTION_NAME), where('code', '==', code));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Country;
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

  uploadCountryDocument: async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `country_docs/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading country document:', error);
      throw error;
    }
  },
};
