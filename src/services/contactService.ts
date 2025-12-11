import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: Timestamp;
  read: boolean;
}

const COLLECTION_NAME = 'messages';

export const contactService = {
  addMessage: async (message: Omit<ContactMessage, 'id' | 'date' | 'read'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...message,
        date: Timestamp.now(),
        read: false,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },
};
