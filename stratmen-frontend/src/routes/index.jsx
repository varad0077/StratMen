import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/layout/PublicLayout';
import { StratChatLayout } from '@/layout/StratChatLayout';

// Route Guards
import { ProtectedMemberRoute } from './ProtectedMemberRoute';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';

// Public Marketing Views
import { Home } from '@/views/landing/Home';
import { Activities } from '@/views/pages/Activities/Activities';
import { Journey } from '@/views/pages/Journey/Journey';
import { AboutUs } from '@/views/pages/AboutUs/AboutUs';

// Auth & Entry Gate Views
import { StratChatLanding } from '@/views/pages/stratchat/StratChatLanding';
import { GoogleAuthCallback } from '@/views/pages/authentication/GoogleAuthCallback';
import { AccessPending } from '@/views/pages/authentication/AccessPending';

// Protected StratChat Portal Views
import { Feed } from '@/views/pages/stratchat/Feed';
import { Profile } from '@/views/pages/stratchat/Profile';
import { GroupChat } from '@/views/pages/stratchat/GroupChat';
import { AdminPortal } from '@/views/pages/stratchat/AdminPortal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'activities', element: <Activities /> },
      { path: 'journey', element: <Journey /> },
      { path: 'about', element: <AboutUs /> },
    ],
  },
  {
    path: '/stratchat',
    element: <StratChatLanding />,
  },
  {
    path: '/auth/callback',
    element: <GoogleAuthCallback />,
  },
  {
    path: '/access-pending',
    element: <AccessPending />,
  },
  {
    path: '/stratchat',
    element: (
      <ProtectedMemberRoute>
        <StratChatLayout />
      </ProtectedMemberRoute>
    ),
    children: [
      { path: 'feed', element: <Feed /> },
      { path: 'profile', element: <Profile /> },
      { path: 'chat', element: <GroupChat /> },
      {
        path: 'admin',
        element: (
          <ProtectedAdminRoute>
            <AdminPortal />
          </ProtectedAdminRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <StratChatLanding />,
  },
]);
