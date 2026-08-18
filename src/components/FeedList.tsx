import React from 'react';
import { PostCard } from './PostCard';
import { Post, User, FeedFilter } from '../types';

interface FeedListProps {
  posts: Post[];
  currentUser: User;
  isAdmin: boolean;
  activeFilter: FeedFilter;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onDeletePost: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  onOpenImageModal: (url: string) => void;
}

export const FeedList: React.FC<FeedListProps> = ({
  posts,
  currentUser,
  isAdmin,
  activeFilter,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onCopyLink,
  onOpenImageModal
}) => {
  if (posts.length === 0) {
    return (
      <div className="card empty-feed-card">
        <p className="empty-feed-title">No updates match this filter</p>
        <p className="empty-feed-subtitle">
          {activeFilter !== 'ALL'
            ? `No posts found under "${activeFilter === 'SAVED' ? 'Saved' : activeFilter === 'MY_POSTS' ? 'My Posts' : activeFilter}".`
            : 'Share a 1-paragraph update above whenever you make an impact!'}
        </p>
      </div>
    );
  }

  return (
    <div className="feed-list-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onToggleLike={onToggleLike}
          onToggleBookmark={onToggleBookmark}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onDeletePost={onDeletePost}
          onCopyLink={onCopyLink}
          onOpenImageModal={onOpenImageModal}
        />
      ))}
    </div>
  );
};
