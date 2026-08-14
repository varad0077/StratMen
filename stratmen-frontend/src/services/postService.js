import { supabase } from '@/config/supabaseClient';

/**
 * Fetch feed posts with author info, likes, comments, and bookmarks.
 * @param {'all'|'mine'|'saved'} filter - Feed filter type.
 * @param {string} [userId] - Current user ID (required for 'mine' and 'saved' filters).
 * @returns {Promise<Array>}
 */
export const getFeedPosts = async (filter = 'all', userId = null) => {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url, role),
      likes(user_id),
      comments(id),
      bookmarks(user_id)
    `)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (filter === 'mine' && userId) {
    query = query.eq('author_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;

  let posts = data || [];

  if (filter === 'saved' && userId) {
    posts = posts.filter((post) =>
      post.bookmarks?.some((b) => b.user_id === userId)
    );
  }

  return posts.map((post) => ({
    ...post,
    like_count: post.likes?.length || 0,
    comment_count: post.comments?.length || 0,
    is_liked: userId ? post.likes?.some((l) => l.user_id === userId) : false,
    is_bookmarked: userId ? post.bookmarks?.some((b) => b.user_id === userId) : false,
  }));
};

/**
 * Create a new post.
 * @param {string} content - Post text content.
 * @param {string|null} imageUrl - Optional Cloudinary image URL.
 * @returns {Promise<Object>}
 */
export const createPost = async (content, imageUrl = null) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('posts')
    .insert([{
      author_id: user.id,
      content,
      image_url: imageUrl,
    }])
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url, role)
    `)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a post by ID.
 * @param {number} postId
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
};

/**
 * Update a post (content, image, pin status).
 * @param {number} postId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updatePost = async (postId, updates) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Toggle pin status of a post (admin only).
 * @param {number} postId
 * @param {boolean} isPinned
 * @returns {Promise<Object>}
 */
export const togglePin = async (postId, isPinned) => {
  return updatePost(postId, { is_pinned: !isPinned });
};
