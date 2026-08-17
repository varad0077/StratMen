import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SplashScreen } from '@/components/SplashScreen';
import { useAuth } from '@/hooks/useAuth';
import { router } from '@/routes';

export const App = () => {
  // Initialize Supabase auth listener and allowlist check at root level
  useAuth();

  return (
    <>
      <SplashScreen duration={1800} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid #E1E5DF',
            color: '#202420',
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};
