import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, Share2, Trash2, Pin } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentSection } from './CommentSection';
import { ImageLightbox } from '@/components/ImageLightbox';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toggleLike } from '@/services/likeService';
import { toggleBookmark } from '@/services/bookmarkService';
import { deletePost, togglePin } from '@/services/postService';
import { formatRelativeTime, copyToClipboard } from '@/lib/utils';
import { toast } from 'sonner';

export const PostCard = ({ post, currentUser, isAdmin, onPostDeleted }) => {
  const [liked, setLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked);
  const [showComments, setShowComments] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const authorName = post.author?.full_name || 'StratMen Member';
  const isOwner = post.author_id === currentUser?.id;
  const canDelete = isOwner || isAdmin;

  const handleLikeToggle = async () => {
    // Optimistic update
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const result = await toggleLike(post.id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      // Revert optimistic update on error
      setLiked(liked);
      setLikeCount(likeCount);
      toast.error('Failed to update like');
    }
  };

  const handleBookmarkToggle = async () => {
    setBookmarked(!bookmarked);
    try {
      const result = await toggleBookmark(post.id);
      setBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? 'Post saved to bookmarks' : 'Post removed from bookmarks');
    } catch (error) {
      setBookmarked(bookmarked);
      toast.error('Failed to update bookmark');
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/stratchat/feed?post=${post.id}`;
    const success = await copyToClipboard(link);
    if (success) {
      toast.success('Post link copied to clipboard!');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await deletePost(post.id);
      toast.success('Post deleted successfully');
      setDeleteConfirmOpen(false);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePin(post.id, post.is_pinned);
      toast.success(post.is_pinned ? 'Post unpinned' : 'Post pinned to top');
    } catch (error) {
      toast.error('Failed to toggle pin status');
    }
  };

  return (
    <>
      <div className={`p-5 rounded-xl border bg-surface-dark space-y-4 transition-all duration-200 ${
        post.is_pinned ? 'border-accent/40 shadow-glow/30' : 'border-border'
      }`}>
        {/* Pinned Badge */}
        {post.is_pinned && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent border-b border-border/50 pb-2">
            <Pin className="h-3.5 w-3.5 fill-accent" />
            <span>Pinned Announcement</span>
          </div>
        )}

        {/* Post Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar src={post.author?.avatar_url} name={authorName} />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-text-primary">{authorName}</h4>
                <Badge variant={post.author?.role === 'admin' ? 'default' : 'secondary'} className="text-[10px]">
                  {post.author?.role === 'admin' ? 'Admin' : 'Member'}
                </Badge>
              </div>
              <p className="text-xs text-text-muted">{formatRelativeTime(post.created_at)}</p>
            </div>
          </div>

          {/* Action Menu (Pin / Delete) */}
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleTogglePin}
                className={post.is_pinned ? 'text-accent' : 'text-text-muted hover:text-accent'}
                title={post.is_pinned ? 'Unpin post' : 'Pin post'}
              >
                <Pin className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setDeleteConfirmOpen(true)}
                className="text-text-muted hover:text-danger hover:bg-danger/10"
                title="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content Text */}
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Content Image */}
        {post.image_url && (
          <div
            onClick={() => setLightboxOpen(true)}
            className="rounded-lg overflow-hidden border border-border cursor-pointer group relative"
          >
            <img
              src={post.image_url}
              alt="Post media"
              className="w-full max-h-96 object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white">
              Click to view full image
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-border-light/40">
          <div className="flex items-center gap-1">
            {/* Like */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeToggle}
              className={liked ? 'text-danger hover:text-danger' : 'text-text-muted hover:text-text-primary'}
            >
              <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-danger text-danger' : ''}`} />
              <span>{likeCount}</span>
            </Button>

            {/* Comment */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-text-muted hover:text-text-primary"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              <span>{post.comment_count || 0}</span>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleBookmarkToggle}
              className={bookmarked ? 'text-accent' : 'text-text-muted hover:text-accent'}
              title="Bookmark post"
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-accent' : ''}`} />
            </Button>

            {/* Copy Link */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopyLink}
              className="text-text-muted hover:text-text-primary"
              title="Copy post link"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Comment Section */}
        {showComments && (
          <CommentSection postId={post.id} currentUser={currentUser} isAdmin={isAdmin} />
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        src={post.image_url}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action will permanently remove it along with all likes and comments."
        confirmText="Delete"
        loading={deleting}
      />
    </>
  );
};
