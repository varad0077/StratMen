import { supabase } from '@/config/supabaseClient';

/**
 * Toggle bookmark on a post. Inserts if not bookmarked, deletes if already bookmarked.
 * @param {number} postId
 * @returns {Promise<{bookmarked: boolean}>}
 */
export const toggleBookmark = async (postId) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { bookmarked: false };
  } else {
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ post_id: postId, user_id: user.id }]);

    if (error) throw error;
    return { bookmarked: true };
  }
};
