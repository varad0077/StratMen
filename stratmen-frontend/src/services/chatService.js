import { supabase } from '@/config/supabaseClient';

/**
 * Fetch group chat messages with author profiles.
 * @param {number} [limit=100] - Max messages to fetch.
 * @param {number|null} [beforeId=null] - Fetch messages before this ID (for pagination).
 * @returns {Promise<Array>}
 */
export const getMessages = async (limit = 100, beforeId = null) => {
  let query = supabase
    .from('chat_messages')
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (beforeId) {
    query = query.lt('id', beforeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Send a chat message.
 * @param {string} content - Message text.
 * @param {string|null} [imageUrl=null] - Optional image attachment URL.
 * @returns {Promise<Object>}
 */
export const sendMessage = async (content, imageUrl = null) => {
  const { data: { user } } = await supabase.auth.getUser();

  const insertData = {
    author_id: user.id,
    content: content.trim(),
  };

  if (imageUrl) {
    insertData.image_url = imageUrl;
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([insertData])
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url)
    `)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a chat message by ID.
 * @param {number} messageId
 * @returns {Promise<void>}
 */
export const deleteMessage = async (messageId) => {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
};
