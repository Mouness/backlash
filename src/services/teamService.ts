import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { DocumentData } from 'firebase/firestore';
import { db, storage } from '../firebase';

export interface LocalizedString {
  en: string;
  fr: string;
  de: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: LocalizedString;
  bio?: LocalizedString;
  email?: string;
  gender: 'female' | 'male';
  order: number;
  photoUrl?: string;
}

const COLLECTION_NAME = 'team';

export const teamService = {
  // Get all team members sorted by 'order'
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        }) as TeamMember,
    );
  },

  // Upload photo to Firebase Storage
  uploadTeamMemberPhoto: async (file: File): Promise<string> => {
    const storageRef = ref(storage, `team-photos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // Add a new team member
  addTeamMember: async (member: Omit<TeamMember, 'id'>) => {
    return await addDoc(collection(db, COLLECTION_NAME), member);
  },

  // Update an existing team member
  updateTeamMember: async (id: string, member: Partial<TeamMember>) => {
    const teamDocRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(teamDocRef, member as DocumentData);
  },

  // Delete a team member
  deleteTeamMember: async (id: string) => {
    const teamDocRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(teamDocRef);
  },
};
