import { supabase } from '@/config/supabaseClient';

/**
 * Toggle like on a post. Inserts if not liked, deletes if already liked.
 * @param {number} postId
 * @returns {Promise<{liked: boolean, likeCount: number}>}
 */
export const toggleLike = async (postId) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: existing } = await supabase
    .from('likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: user.id }]);

    if (error) throw error;
  }

  const { count, error: countError } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (countError) throw countError;

  return {
    liked: !existing,
    likeCount: count || 0,
  };
};
