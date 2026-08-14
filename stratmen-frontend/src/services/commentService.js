import { supabase } from '@/config/supabaseClient';

/**
 * Fetch comments for a specific post.
 * @param {number} postId
 * @returns {Promise<Array>}
 */
export const getComments = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Add a comment to a post.
 * @param {number} postId
 * @param {string} content
 * @returns {Promise<Object>}
 */
export const addComment = async (postId, content) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      author_id: user.id,
      content,
    }])
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url)
    `)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a comment by ID.
 * @param {number} commentId
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};
