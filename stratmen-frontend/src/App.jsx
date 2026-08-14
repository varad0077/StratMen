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
        theme="dark"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            color: '#F5F5F5',
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};
