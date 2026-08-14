import React, { useState, useEffect, useCallback } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getComments, addComment, deleteComment } from '@/services/commentService';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

export const CommentSection = ({ postId, currentUser, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await addComment(postId, newComment.trim());
      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="pt-3 space-y-4 border-t border-border-light/60">
      {/* Input */}
      <form onSubmit={handleAddComment} className="flex items-center gap-2">
        <UserAvatar
          src={currentUser?.user_metadata?.avatar_url}
          name={currentUser?.user_metadata?.full_name || currentUser?.email}
          size="sm"
        />
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="h-9 text-xs"
        />
        <Button type="submit" size="sm" disabled={submitting || !newComment.trim()} className="h-9">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-xs text-text-muted italic">Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const authorName = comment.author?.full_name || 'Member';
            const isOwner = comment.author_id === currentUser?.id;
            const canDelete = isOwner || isAdmin;

            return (
              <div key={comment.id} className="flex items-start gap-2.5 group">
                <UserAvatar src={comment.author?.avatar_url} name={authorName} size="sm" />
                <div className="flex-1 bg-surface-elevated/50 p-2.5 rounded-lg border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">{authorName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted">{formatRelativeTime(comment.created_at)}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-opacity cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{comment.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-text-muted italic">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};
