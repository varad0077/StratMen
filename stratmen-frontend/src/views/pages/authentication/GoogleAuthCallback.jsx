import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '@/config/supabaseClient';
import { checkAllowlist } from '@/services/allowlistService';
import { getUserProfile } from '@/services/authService';
import { setSession, setProfile, setAllowlistStatus, setLoading } from '@/store/authSlice';
import { PageLoader } from '@/components/Loader';
import { toast } from 'sonner';

export const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          dispatch(setSession(session));

          try {
            const profile = await getUserProfile(session.user.id);
            if (profile) dispatch(setProfile(profile));
          } catch (pErr) {
            console.error('Profile load error:', pErr);
          }

          const allowlistStatus = await checkAllowlist(session.user.email);
          dispatch(setAllowlistStatus(allowlistStatus));
          dispatch(setLoading(false));

          if (allowlistStatus.isAllowed) {
            toast.success('Successfully authenticated with Google!');
            navigate('/stratchat/feed', { replace: true });
          } else {
            navigate('/access-pending', { replace: true });
          }
        } else {
          dispatch(setLoading(false));
          navigate('/stratchat', { replace: true });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Google authentication failed. Please try again.');
        dispatch(setLoading(false));
        navigate('/stratchat', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, dispatch]);

  return <PageLoader text="Verifying Google Authentication & Allowlist Status..." />;
};
