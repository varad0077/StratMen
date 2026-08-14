import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabaseClient';
import { checkAllowlist } from '@/services/allowlistService';
import { PageLoader } from '@/components/Loader';
import { toast } from 'sonner';

export const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const { isAllowed } = await checkAllowlist(session.user.email);
          if (isAllowed) {
            toast.success('Successfully authenticated with Google!');
            navigate('/stratchat/feed', { replace: true });
          } else {
            navigate('/access-pending', { replace: true });
          }
        } else {
          navigate('/stratchat', { replace: true });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Google authentication failed. Please try again.');
        navigate('/stratchat', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <PageLoader text="Verifying Google Authentication..." />;
};
