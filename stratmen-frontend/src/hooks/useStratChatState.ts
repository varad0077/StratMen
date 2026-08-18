import { useState, useEffect, useMemo } from 'react';
import { INITIAL_ALLOWLIST, AllowedUser, isEmailAllowed } from '../data/allowlist';
import {
  auth,
  onAuthStateChanged,
  logOutFirebase,
  subscribeToPosts,
  subscribeToAllowlist,
  createPostInFirestore,
  toggleLikeInFirestore,
  toggleBookmarkInFirestore,
  addCommentToFirestore,
  deletePostFromFirestore,
  addAllowedUserToFirestore,
  removeAllowedUserFromFirestore
} from '../backend';
import { Post, User, FeedFilter, ToastMessage } from '../types';

const DEFAULT_POSTS: Post[] = [
  {
    id: 'post-seed-1',
    author: {
      id: 'admin-1',
      name: 'StratChat Admin',
      role: 'StratChat Admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=StratChat%20Admin'
    },
    content: 'Welcome to StratChat! We have officially launched our private communication portal for StratMen Founders, Leads, and Members. Share strategic updates and announcements below.',
    timestamp: '2 hours ago',
    likesCount: 5,
    isLiked: false,
    isBookmarked: true,
    comments: []
  }
];

export const useStratChatState = () => {
  // Allowlist State
  const [allowlist, setAllowlist] = useState<AllowedUser[]>(() => {
    const saved = localStorage.getItem('stratchat_allowlist');
    if (!saved) return INITIAL_ALLOWLIST;
    try {
      const list: AllowedUser[] = JSON.parse(saved);
      return Array.isArray(list) && list.length > 0 ? list : INITIAL_ALLOWLIST;
    } catch (e) {
      return INITIAL_ALLOWLIST;
    }
  });

  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const isSignedOut = localStorage.getItem('stratchat_signed_out');
    if (isSignedOut === 'true') return null;
    const saved = localStorage.getItem('stratchat_auth_user');
    if (!saved || saved === 'undefined') return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const isSignedOut = localStorage.getItem('stratchat_signed_out');
    if (isSignedOut === 'true') return false;
    const saved = localStorage.getItem('stratchat_is_admin');
    if (!saved || saved === 'undefined') return false;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return false;
    }
  });

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('stratchat_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Filter State
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('ALL');

  // Modals & Image Lightbox State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Toast System State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Posts Feed State
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('stratchat_posts');
    if (saved && saved !== 'undefined') {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse posts:', e);
      }
    }
    return DEFAULT_POSTS;
  });

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = `t-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-accent', 'lime');
    localStorage.setItem('stratchat_theme', theme);
  }, [theme]);

  // Realtime Firestore Allowlist Sync
  useEffect(() => {
    const unsubscribe = subscribeToAllowlist((remoteAllowlist) => {
      if (Array.isArray(remoteAllowlist) && remoteAllowlist.length > 0) {
        setAllowlist(remoteAllowlist);
      }
    });
    return () => unsubscribe();
  }, []);

  // Realtime Firestore Posts Sync
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToPosts(user.id, (remotePosts) => {
      if (Array.isArray(remotePosts) && remotePosts.length > 0) {
        setPosts(remotePosts);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      const isSignedOut = localStorage.getItem('stratchat_signed_out');
      if (isSignedOut === 'true') return;

      if (fbUser && fbUser.email) {
        const cleanEmail = fbUser.email.toLowerCase();
        const matched = isEmailAllowed(cleanEmail, allowlist);
        if (matched) {
          const authUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || matched.name,
            role: matched.role,
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matched.name)}`,
            email: cleanEmail
          };
          setUser(authUser);
          setIsAdmin(matched.isAdmin || false);
        }
      }
    });

    return () => unsubscribe();
  }, [allowlist]);

  // Local Storage Backups
  useEffect(() => {
    try {
      localStorage.setItem('stratchat_allowlist', JSON.stringify(allowlist));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [allowlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('stratchat_auth_user', JSON.stringify(user));
        localStorage.setItem('stratchat_is_admin', JSON.stringify(isAdmin));
      } else {
        localStorage.removeItem('stratchat_auth_user');
        localStorage.removeItem('stratchat_is_admin');
      }
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem('stratchat_posts', JSON.stringify(posts));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [posts]);

  // Handlers
  const handleLoginSuccess = (authUser: User, adminStatus: boolean) => {
    localStorage.removeItem('stratchat_signed_out');
    setUser(authUser);
    setIsAdmin(adminStatus);
    addToast('success', `Welcome back, ${authUser.name}!`);
  };

  const handleLogout = async () => {
    localStorage.setItem('stratchat_signed_out', 'true');
    localStorage.removeItem('stratchat_auth_user');
    localStorage.removeItem('stratchat_is_admin');
    setUser(null);
    setIsAdmin(false);
    await logOutFirebase();
    addToast('info', 'Signed out of StratChat.');
  };

  const handleAddAllowedUser = async (newUser: AllowedUser) => {
    setAllowlist((prev) => [...prev.filter((u) => u.email !== newUser.email), newUser]);
    addToast('success', `Authorized member: ${newUser.name} (${newUser.email})`);
    try {
      await addAllowedUserToFirestore(newUser);
    } catch (e) {
      console.log('Using local allowlist mode');
    }
  };

  const handleRemoveAllowedUser = async (email: string) => {
    setAllowlist((prev) => prev.filter((u) => u.email !== email));
    addToast('warning', `Revoked member access for ${email}`);
    try {
      await removeAllowedUserFromFirestore(email);
    } catch (e) {
      console.log('Using local allowlist mode');
    }
  };

  const handleAddPost = async (newPostData: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'comments'>) => {
    const tempId = `post-${Date.now()}`;
    const newPost: Post = {
      ...newPostData,
      id: tempId,
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: []
    };

    setPosts((prev) => [newPost, ...prev]);
    addToast('success', 'Published update to StratChat feed!');

    try {
      await createPostInFirestore(newPostData);
    } catch (e) {
      console.log('Firestore write fallback');
    }
  };

  const handleToggleLike = async (postId: string) => {
    let targetPost = posts.find((p) => p.id === postId);
    const currentlyLiked = targetPost ? Boolean(targetPost.isLiked) : false;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
        };
      })
    );

    if (user) {
      try {
        await toggleLikeInFirestore(postId, user.id, currentlyLiked);
      } catch (e) {
        console.log('Firestore like toggle fallback');
      }
    }
  };

  const handleToggleBookmark = async (postId: string) => {
    let targetPost = posts.find((p) => p.id === postId);
    const currentlyBookmarked = targetPost ? Boolean(targetPost.isBookmarked) : false;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const isBookmarked = !post.isBookmarked;
        addToast('info', isBookmarked ? 'Saved update to your bookmarks.' : 'Removed update from bookmarks.');
        return { ...post, isBookmarked };
      })
    );

    if (user) {
      try {
        await toggleBookmarkInFirestore(postId, user.id, currentlyBookmarked);
      } catch (e) {
        console.log('Firestore bookmark fallback');
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    addToast('info', 'Update deleted.');
    try {
      await deletePostFromFirestore(postId);
    } catch (e) {
      console.log('Firestore delete fallback');
    }
  };

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/#post-${postId}`;
    navigator.clipboard.writeText(url);
    addToast('success', 'Copied update link to clipboard!');
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    if (!user) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: commentText,
      timestamp: 'Just now'
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      })
    );
    addToast('success', 'Comment added.');

    try {
      await addCommentToFirestore(postId, newComment);
    } catch (e) {
      console.log('Firestore comment fallback');
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: (post.comments || []).filter((c) => c.id !== commentId)
        };
      })
    );
    addToast('info', 'Comment removed.');
  };

  // Computations
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.filter((post) => {
      if (!post || !post.author) return false;
      if (activeFilter === 'SAVED' && !post.isBookmarked) return false;
      if (activeFilter === 'MY_POSTS') {
        const isMyPost = post.author.name === user?.name || post.author.id === user?.id;
        if (!isMyPost) return false;
      }
      return true;
    });
  }, [posts, activeFilter, user]);

  const userPostsCount = posts.filter((p) => p && p.author && (p.author.name === user?.name || p.author.id === user?.id)).length;
  const userLikesReceived = posts
    .filter((p) => p && p.author && (p.author.name === user?.name || p.author.id === user?.id))
    .reduce((sum, p) => sum + (p.likesCount || 0), 0);
  const bookmarkedCount = posts.filter((p) => p && p.isBookmarked).length;

  return {
    allowlist,
    user,
    isAdmin,
    theme,
    setTheme,
    activeFilter,
    setActiveFilter,
    isAdminModalOpen,
    setIsAdminModalOpen,
    activeModalImage,
    setActiveModalImage,
    toasts,
    handleDismissToast,
    posts,
    filteredPosts,
    userPostsCount,
    userLikesReceived,
    bookmarkedCount,
    handleLoginSuccess,
    handleLogout,
    handleAddAllowedUser,
    handleRemoveAllowedUser,
    handleAddPost,
    handleToggleLike,
    handleToggleBookmark,
    handleDeletePost,
    handleCopyLink,
    handleAddComment,
    handleDeleteComment
  };
};
