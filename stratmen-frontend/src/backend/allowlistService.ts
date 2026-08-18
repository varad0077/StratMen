import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { AllowedUser } from '../data/allowlist';

const ALLOWLIST_COLLECTION = 'allowlist';

/**
 * Subscribes to realtime updates of allowed members in Firestore
 */
export const subscribeToAllowlist = (onUpdate: (allowlist: AllowedUser[]) => void) => {
  const colRef = collection(db, ALLOWLIST_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AllowedUser[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          email: data.email || docSnap.id,
          name: data.name || docSnap.id.split('@')[0],
          role: data.role || 'StratMen Member',
          isAdmin: Boolean(data.isAdmin)
        };
      });
      onUpdate(list);
    },
    (error) => {
      console.error('Firestore allowlist snapshot error:', error);
    }
  );
};

/**
 * Adds or updates an allowed user in Firestore
 */
export const addAllowedUserToFirestore = async (user: AllowedUser): Promise<void> => {
  try {
    const cleanEmail = user.email.trim().toLowerCase();
    const docRef = doc(db, ALLOWLIST_COLLECTION, cleanEmail);
    await setDoc(docRef, {
      email: cleanEmail,
      name: user.name,
      role: user.role,
      isAdmin: Boolean(user.isAdmin),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firestore addAllowedUser error:', error);
    throw error;
  }
};

/**
 * Removes an allowed user from Firestore
 */
export const removeAllowedUserFromFirestore = async (email: string): Promise<void> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const docRef = doc(db, ALLOWLIST_COLLECTION, cleanEmail);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Firestore removeAllowedUser error:', error);
    throw error;
  }
};
