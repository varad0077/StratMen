export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export type FeedFilter = 'ALL' | 'SAVED' | 'MY_POSTS';

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments: Comment[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

export type AccentColor = 'lime';
