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

import type { TeamMember } from '../types/models';

const COLLECTION_NAME = 'team';

export const teamService = {
  // Get all team members sorted by 'order'
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as TeamMember,
      );
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  },

  // Upload photo to Firebase Storage
  uploadTeamMemberPhoto: async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `team-photos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading team member photo:', error);
      throw error;
    }
  },

  // Add a new team member
  addTeamMember: async (member: Omit<TeamMember, 'id'>) => {
    try {
      return await addDoc(collection(db, COLLECTION_NAME), member);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },

  // Update an existing team member
  updateTeamMember: async (id: string, member: Partial<TeamMember>) => {
    try {
      const teamDocRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(teamDocRef, member as DocumentData);
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Delete a team member
  deleteTeamMember: async (id: string) => {
    try {
      const teamDocRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(teamDocRef);
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};
