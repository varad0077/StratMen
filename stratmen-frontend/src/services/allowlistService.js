import { supabase } from '@/config/supabaseClient';

/**
 * Check if a given email is in the allowlist.
 * @param {string} email
 * @returns {Promise<{isAllowed: boolean, isAdmin: boolean}>}
 */
export const checkAllowlist = async (email) => {
  if (!email) return { isAllowed: false, isAdmin: false };

  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('allowlist')
    .select('email, is_admin')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (error) {
    console.error('Allowlist query error:', error.message);
    return { isAllowed: false, isAdmin: false };
  }

  return {
    isAllowed: !!data,
    isAdmin: data?.is_admin || false,
  };
};

/**
 * Get all allowlisted members (admin only).
 * @param {string} [search] - Optional search term.
 * @returns {Promise<Array>}
 */
export const getAllowlist = async (search = '') => {
  let query = supabase
    .from('allowlist')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Add a member to the allowlist (admin only).
 * @param {{email: string, name: string, role?: string, is_admin?: boolean}} memberData
 * @returns {Promise<Object>}
 */
export const addMember = async (memberData) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('allowlist')
    .insert([{
      email: memberData.email.toLowerCase(),
      name: memberData.name,
      role: memberData.role || 'StratMen Member',
      is_admin: memberData.is_admin || false,
      added_by: user.id,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update a member in the allowlist (admin only).
 * @param {string} email
 * @param {Object} updates - Fields to update (role, is_admin).
 * @returns {Promise<Object>}
 */
export const updateMember = async (email, updates) => {
  const { data, error } = await supabase
    .from('allowlist')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Revoke a member's access by removing them from the allowlist (admin only).
 * @param {string} email
 * @returns {Promise<void>}
 */
export const revokeMember = async (email) => {
  const { error } = await supabase
    .from('allowlist')
    .delete()
    .eq('email', email.toLowerCase());

  if (error) throw error;
};
