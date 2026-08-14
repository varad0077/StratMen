import { supabase } from '@/config/supabaseClient';

/**
 * Sign up with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<{data, error}>}
 */
export const signUpWithEmail = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Log in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data, error}>}
 */
export const loginWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Initiate Google OAuth login. Redirects to Google consent screen.
 */
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Log out current user.
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the current active session.
 * @returns {Promise<{session}>}
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

/**
 * Get the current authenticated user.
 * @returns {Promise<{user}>}
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Get the user's profile from the profiles table.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getUserProfile = async (userId) => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Profile fetch notice:', error.message);
    return null;
  }

  if (!data) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id === userId) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert([{
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member',
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || null,
        }])
        .select()
        .maybeSingle();
      return newProfile;
    }
  }

  return data;
};

/**
 * Update the current user's profile.
 * @param {string} userId
 * @param {Object} updates - Fields to update (full_name, phone, avatar_url).
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
