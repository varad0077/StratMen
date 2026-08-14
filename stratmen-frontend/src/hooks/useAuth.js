import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/config/supabaseClient';
import { setSession, setProfile, setAllowlistStatus, setLoading, clearAuth } from '@/store/authSlice';
import { checkAllowlist } from '@/services/allowlistService';
import { getUserProfile } from '@/services/authService';

/**
 * Custom hook that initializes and manages Supabase auth state.
 * Listens for auth state changes, checks allowlist, and dispatches to Redux.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session && mounted) {
          dispatch(setSession(session));

          try {
            const profile = await getUserProfile(session.user.id);
            if (mounted && profile) dispatch(setProfile(profile));
          } catch (pErr) {
            console.error('Profile fetch notice:', pErr);
          }

          try {
            const allowlistStatus = await checkAllowlist(session.user.email);
            if (mounted) dispatch(setAllowlistStatus(allowlistStatus));
          } catch (aErr) {
            console.error('Allowlist check notice:', aErr);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error.message);
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          dispatch(setSession(session));

          try {
            const profile = await getUserProfile(session.user.id);
            if (mounted && profile) dispatch(setProfile(profile));
          } catch (pErr) {
            console.error('Profile fetch notice:', pErr);
          }

          try {
            const allowlistStatus = await checkAllowlist(session.user.email);
            if (mounted) dispatch(setAllowlistStatus(allowlistStatus));
          } catch (aErr) {
            console.error('Allowlist check notice:', aErr);
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch(clearAuth());
        }

        if (mounted) dispatch(setLoading(false));
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  return auth;
};
