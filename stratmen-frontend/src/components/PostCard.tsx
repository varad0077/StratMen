import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Send, Bookmark, MoreVertical, Share2, Trash2, CheckCircle2 } from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User;
  isAdmin: boolean;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onDeletePost: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  onOpenImageModal: (imageUrl: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  isAdmin,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onCopyLink,
  onOpenImageModal
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const author = post?.author || { name: 'Member', role: 'Member', avatar: '', id: 'unknown' };
  const commentsList = Array.isArray(post?.comments) ? post.comments : [];
  const likesCount = typeof post?.likesCount === 'number' ? post.likesCount : 0;

  const isAuthor = Boolean(currentUser && (author.name === currentUser.name || author.id === currentUser.id));
  const canDeletePost = isAuthor || isAdmin;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <article className="post-card">
      {/* LinkedIn/Insta Header */}
      <div className="post-header">
        <div className="author-meta">
          <div className="author-avatar-wrap">
            <img
              src={author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`}
              alt={author.name}
              className="author-avatar"
            />
            <span className="online-dot" />
          </div>
          <div className="author-details">
            <div className="author-name-row">
              <span className="author-name">{author.name}</span>
              <CheckCircle2 size={13} style={{ color: 'var(--brand-lime)' }} />
              <span className="badge badge-lime">{author.role || 'Member'}</span>
            </div>
            <div className="post-subhead-row">
              <span className="post-time">{post.timestamp || 'Recently'}</span>
            </div>
          </div>
        </div>

        {/* Post Options Dropdown */}
        <div className="post-options-wrapper" ref={menuRef}>
          <button
            type="button"
            className="post-options-btn"
            onClick={() => setShowMenu(!showMenu)}
            title="Post Options"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="post-dropdown-menu">
              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  onToggleBookmark(post.id);
                  setShowMenu(false);
                }}
              >
                <Bookmark size={14} />
                <span>{post.isBookmarked ? 'Remove Bookmark' : 'Save Update'}</span>
              </button>

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  onCopyLink(post.id);
                  setShowMenu(false);
                }}
              >
                <Share2 size={14} />
                <span>Copy Link</span>
              </button>

              {canDeletePost && (
                <button
                  type="button"
                  className="dropdown-menu-item danger"
                  onClick={() => {
                    onDeletePost(post.id);
                    setShowMenu(false);
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Update</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Post Body */}
      <p className="post-content-paragraph">{post.content}</p>

      {/* Media Attachment */}
      {post.imageUrl && (
        <div className="post-image-wrapper">
          <img
            src={post.imageUrl}
            alt="Post attachment"
            className="post-image-attachment"
            onClick={() => onOpenImageModal(post.imageUrl!)}
          />
        </div>
      )}

      {/* Engagement Counters Row */}
      <div className="post-stats-row">
        <div className="stats-likes">
          <span className="stats-icon-badge">👍</span>
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
        </div>
        <div className="stats-comments" onClick={() => setShowComments(!showComments)}>
          <span>{commentsList.length} {commentsList.length === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>

      {/* Professional LinkedIn / Instagram Action Bar */}
      <div className="post-actions-bar">
        <button
          type="button"
          className={`action-button ${post.isLiked ? 'active' : ''}`}
          onClick={() => onToggleLike(post.id)}
        >
          <ThumbsUp size={16} />
          <span>{post.isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          type="button"
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={16} />
          <span>Comment</span>
        </button>

        <button
          type="button"
          className={`action-button ${post.isBookmarked ? 'active' : ''}`}
          onClick={() => onToggleBookmark(post.id)}
        >
          <Bookmark size={16} />
          <span>{post.isBookmarked ? 'Saved' : 'Save'}</span>
        </button>

        <button
          type="button"
          className="action-button"
          onClick={() => onCopyLink(post.id)}
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleCommentSubmit} className="add-comment-row">
            <img src={currentUser?.avatar} alt={currentUser?.name || 'User'} className="comment-user-avatar" />
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary send-comment-btn" disabled={!commentInput.trim()}>
              <Send size={14} />
            </button>
          </form>

          {commentsList.map((comment) => {
            const canDeleteComment = Boolean(currentUser && (comment.authorName === currentUser.name || isAdmin));

            return (
              <div key={comment.id} className="comment-item">
                <img
                  src={comment.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.authorName || 'Commenter')}`}
                  alt={comment.authorName}
                  className="comment-author-avatar"
                />
                <div className="comment-bubble">
                  <div className="comment-header-row">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-time">{comment.timestamp}</span>
                  </div>
                  <div className="comment-text">{comment.content}</div>
                </div>

                {canDeleteComment && (
                  <button
                    type="button"
                    className="delete-comment-btn"
                    onClick={() => onDeleteComment(post.id, comment.id)}
                    title="Delete comment"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};
