import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

import type { Publication } from '../types/models';
import type { DocumentSnapshot } from 'firebase/firestore';

const COLLECTION_NAME = 'publications';

export const publicationService = {
  getPublications: async (
    limitCount: number = 10,
    lastDoc: DocumentSnapshot | null = null,
  ): Promise<{ publications: Publication[]; lastDoc: DocumentSnapshot | null }> => {
    try {
      let q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'), limit(limitCount));

      if (lastDoc) {
        q = query(
          collection(db, COLLECTION_NAME),
          orderBy('date', 'desc'),
          startAfter(lastDoc),
          limit(limitCount),
        );
      }

      const querySnapshot = await getDocs(q);
      const publications = querySnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as Publication,
      );

      return {
        publications,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      };
    } catch (error) {
      console.error('Error getting publications:', error);
      throw error;
    }
  },

  getPublication: async (id: string): Promise<Publication | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Publication;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting publication:', error);
      throw error;
    }
  },

  addPublication: async (publication: Omit<Publication, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), publication);
      return docRef.id;
    } catch (error) {
      console.error('Error adding publication:', error);
      throw error;
    }
  },

  updatePublication: async (id: string, publication: Partial<Publication>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      // Ensure we don't accidentally overwrite with ID in data, similar to countryService
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...data } = publication;
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating publication:', error);
      throw error;
    }
  },

  deletePublication: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting publication:', error);
      throw error;
    }
  },

  uploadPublicationImage: async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `publications/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading publication image:', error);
      throw error;
    }
  },

  uploadPublicationDocument: async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading publication document:', error);
      throw error;
    }
  },
};
