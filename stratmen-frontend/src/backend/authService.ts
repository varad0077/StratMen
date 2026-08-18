import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export interface AuthUserProfile {
  email: string;
  name: string;
  photoURL: string;
}

/**
 * Triggers real Google OAuth Sign-in Popup using Firebase Auth
 */
export const signInWithGoogle = async (): Promise<AuthUserProfile> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || 'Member',
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || 'Member')}`
    };
  } catch (error: any) {
    console.error('Firebase Google Auth error:', error);
    throw error;
  }
};

/**
 * Signs out current user from Firebase Auth
 */
export const logOutFirebase = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase SignOut error:', error);
  }
};

export { onAuthStateChanged, type FirebaseUser };
