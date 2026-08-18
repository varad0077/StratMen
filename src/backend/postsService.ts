import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, Comment } from '../types';

const POSTS_COLLECTION = 'posts';

/**
 * Subscribes to realtime updates of feed posts in Firestore
 */
export const subscribeToPosts = (currentUserId: string, onUpdate: (posts: Post[]) => void) => {
  const colRef = collection(db, POSTS_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const posts: Post[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const likedBy: string[] = Array.isArray(data.likedBy) ? data.likedBy : [];
        const bookmarkedBy: string[] = Array.isArray(data.bookmarkedBy) ? data.bookmarkedBy : [];

        return {
          id: docSnap.id,
          author: data.author || { name: 'Member', role: 'Member', avatar: '' },
          content: data.content || '',
          imageUrl: data.imageUrl || undefined,
          timestamp: data.createdAt?.toDate ? formatRelativeTime(data.createdAt.toDate()) : 'Just now',
          likesCount: likedBy.length,
          isLiked: likedBy.includes(currentUserId),
          isBookmarked: bookmarkedBy.includes(currentUserId),
          comments: Array.isArray(data.comments) ? data.comments : []
        };
      });
      onUpdate(posts);
    },
    (error) => {
      console.error('Firestore posts snapshot error:', error);
    }
  );
};

/**
 * Creates a new post in Firestore
 */
export const createPostInFirestore = async (
  postData: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'comments'>
): Promise<string> => {
  try {
    const colRef = collection(db, POSTS_COLLECTION);
    const docRef = await addDoc(colRef, {
      author: postData.author,
      content: postData.content,
      imageUrl: postData.imageUrl || null,
      likedBy: [],
      bookmarkedBy: [],
      comments: [],
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Firestore createPost error:', error);
    throw error;
  }
};

/**
 * Toggles like on a post in Firestore
 */
export const toggleLikeInFirestore = async (postId: string, userId: string, isCurrentlyLiked: boolean): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    if (isCurrentlyLiked) {
      await updateDoc(postRef, {
        likedBy: arrayRemove(userId)
      });
    } else {
      await updateDoc(postRef, {
        likedBy: arrayUnion(userId)
      });
    }
  } catch (error) {
    console.error('Firestore toggleLike error:', error);
    throw error;
  }
};

/**
 * Toggles bookmark on a post in Firestore
 */
export const toggleBookmarkInFirestore = async (postId: string, userId: string, isCurrentlyBookmarked: boolean): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    if (isCurrentlyBookmarked) {
      await updateDoc(postRef, {
        bookmarkedBy: arrayRemove(userId)
      });
    } else {
      await updateDoc(postRef, {
        bookmarkedBy: arrayUnion(userId)
      });
    }
  } catch (error) {
    console.error('Firestore toggleBookmark error:', error);
    throw error;
  }
};

/**
 * Adds a comment to a post in Firestore
 */
export const addCommentToFirestore = async (postId: string, comment: Comment): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
  } catch (error) {
    console.error('Firestore addComment error:', error);
    throw error;
  }
};

/**
 * Deletes a post from Firestore
 */
export const deletePostFromFirestore = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Firestore deletePost error:', error);
    throw error;
  }
};

/**
 * Helper to format date relative to current time
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
