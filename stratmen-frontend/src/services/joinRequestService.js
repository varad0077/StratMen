import { supabase } from '@/config/supabaseClient';

/**
 * Submit a join request (public — no auth required for insert per RLS).
 * @param {{full_name: string, email: string, phone: string, linkedin_url?: string, reason: string}} data
 * @returns {Promise<Object>}
 */
export const submitApplication = async (data) => {
  const { data: result, error } = await supabase
    .from('join_requests')
    .insert([{
      full_name: data.full_name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      linkedin_url: data.linkedin_url || null,
      reason: data.reason,
    }]);

  if (error) {
    if (error.code === '23505') {
      throw new Error('An application with this email has already been submitted.');
    }
    throw error;
  }
  return { success: true };
};

/**
 * Get join requests filtered by status (admin only).
 * @param {string} [status] - 'pending', 'approved', 'rejected', or undefined for all.
 * @returns {Promise<Array>}
 */
export const getRequests = async (status = null) => {
  let query = supabase
    .from('join_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Update a join request status (admin only).
 * Approving auto-creates an allowlist entry.
 * @param {number} requestId
 * @param {'approved'|'rejected'} status
 * @param {string} [adminNotes]
 * @returns {Promise<Object>}
 */
export const updateRequestStatus = async (requestId, status, adminNotes = '') => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: request, error: updateError } = await supabase
    .from('join_requests')
    .update({
      status,
      admin_notes: adminNotes || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .select()
    .single();

  if (updateError) throw updateError;

  if (status === 'approved' && request) {
    const { error: allowlistError } = await supabase
      .from('allowlist')
      .insert([{
        email: request.email.toLowerCase(),
        name: request.full_name,
        role: 'StratMen Member',
        is_admin: false,
        added_by: user.id,
      }]);

    if (allowlistError && allowlistError.code !== '23505') {
      throw allowlistError;
    }
  }

  return request;
};
