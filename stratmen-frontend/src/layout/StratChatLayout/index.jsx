import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const StratChatLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-warm text-text-dark">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <LeftSidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};
