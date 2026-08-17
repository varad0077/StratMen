import { supabase } from '@/config/supabaseClient';

/**
 * Get dashboard statistics (admin only).
 * @returns {Promise<Object>}
 */
export const getDashboardStats = async () => {
  const [
    { count: totalProfiles },
    { count: totalPosts },
    { count: totalAllowlisted },
    { count: totalPendingRequests },
    { count: totalChatMessages },
    { count: totalActivities },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('allowlist').select('*', { count: 'exact', head: true }),
    supabase.from('join_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalProfiles: totalProfiles || 0,
    totalPosts: totalPosts || 0,
    totalAllowlisted: totalAllowlisted || 0,
    totalPendingRequests: totalPendingRequests || 0,
    totalChatMessages: totalChatMessages || 0,
    totalActivities: totalActivities || 0,
  };
};

/**
 * Get admin audit logs (admin only).
 * @param {number} [page=1]
 * @param {number} [limit=50]
 * @returns {Promise<{logs: Array, total: number}>}
 */
export const getAuditLogs = async (page = 1, limit = 50) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('admin_action_logs')
      .select(`
        *,
        admin:profiles(id, full_name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      return { logs: data, total: count !== null ? count : data.length };
    }
  } catch (joinErr) {
    console.warn('Joined audit logs query error, attempting flat query:', joinErr);
  }

  // Fallback flat query
  const { data, error, count } = await supabase
    .from('admin_action_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Audit logs query error:', error);
    return { logs: [], total: 0 };
  }
  return { logs: data || [], total: count !== null ? count : (data?.length || 0) };
};

/**
 * Log an admin action to the audit trail.
 * @param {string} action - Description of the action.
 * @param {string} [targetTable] - Target table name.
 * @param {string|number} [targetId] - Target record ID.
 * @param {Object} [details] - Additional JSONB details.
 * @returns {Promise<void>}
 */
export const logAction = async (action, targetTable = null, targetId = null, details = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('admin_action_logs')
      .insert([{
        admin_id: user.id,
        action,
        target_table: targetTable,
        target_id: targetId ? String(targetId) : null,
        details: details || null,
      }]);

    if (error) {
      console.warn('Audit log insert note:', error.message);
    }
  } catch (err) {
    console.error('Audit log exception:', err);
  }
};

/**
 * Get all users for admin management (admin only).
 * @param {string} [search]
 * @param {'active'|'suspended'|null} [status]
 * @returns {Promise<Array>}
 */
export const getUsers = async (search = '', status = null) => {
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (status === 'active') {
    query = query.eq('is_suspended', false);
  } else if (status === 'suspended') {
    query = query.eq('is_suspended', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Suspend a user (admin only).
 * @param {string} userId - UUID of the user.
 * @returns {Promise<Object>}
 */
export const suspendUser = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_suspended: true, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  await logAction('Suspended user', 'profiles', userId);
  return data;
};

/**
 * Unsuspend a user (admin only).
 * @param {string} userId - UUID of the user.
 * @returns {Promise<Object>}
 */
export const unsuspendUser = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_suspended: false, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  await logAction('Unsuspended user', 'profiles', userId);
  return data;
};

/**
 * Delete a user profile (admin only — cascades via FK).
 * @param {string} userId - UUID of the user.
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  await logAction('Deleted user', 'profiles', userId);

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
};
