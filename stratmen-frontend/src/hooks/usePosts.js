import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/config/supabaseClient';
import { getFeedPosts } from '@/services/postService';
import { toast } from 'sonner';

/**
 * Custom hook for fetching posts with Supabase Realtime subscription.
 * @param {'all'|'mine'|'saved'} filter - Feed filter type.
 */
export const usePosts = (filter = 'all') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFeedPosts(filter, user?.id);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      toast.error('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter, user?.id]);

  useEffect(() => {
    fetchPosts();

    const postsChannel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => {
          fetchPosts();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [fetchPosts]);

  return { posts, loading, refetch: fetchPosts };
};
