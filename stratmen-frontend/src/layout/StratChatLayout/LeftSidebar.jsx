import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, MessageSquare, User, Shield, Sparkles, X } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { closeMobileSidebar } from '@/store/uiSlice';

export const LeftSidebar = () => {
  const { user, profile, isAdmin } = useSelector((state) => state.auth);
  const { mobileSidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Member';
  const roleName = profile?.role === 'admin' || isAdmin ? 'Founder / Admin' : 'StratMen Member';

  const navItems = [
    { name: 'Feed', path: '/stratchat/feed', icon: Home },
    { name: 'Group Chat', path: '/stratchat/chat', icon: MessageSquare },
    { name: 'Profile', path: '/stratchat/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Portal', path: '/stratchat/admin', icon: Shield, isAdmin: true });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full space-y-6">
      {/* Profile summary card */}
      <div className="p-4 rounded-xl border border-border bg-surface-dark flex items-center gap-3">
        <UserAvatar
          src={profile?.avatar_url || user?.user_metadata?.avatar_url}
          name={displayName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">{displayName}</h4>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
          <Badge variant={isAdmin ? 'default' : 'secondary'} className="mt-1 text-[10px]">
            {roleName}
          </Badge>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-1 flex-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => dispatch(closeMobileSidebar())}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? item.isAdmin
                      ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                      : 'bg-accent text-bg-dark font-semibold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
              {item.isAdmin && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Community tagline footer */}
      <div className="p-3 rounded-lg border border-border-light/50 bg-surface-elevated/40 text-xs text-text-muted flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent shrink-0" />
        <span>Building strategic leaders together.</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 p-4 border-r border-border min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => dispatch(closeMobileSidebar())}
          />
          <div className="relative z-10 w-72 bg-bg-dark border-r border-border p-4 flex flex-col h-full animate-slide-up">
            <button
              onClick={() => dispatch(closeMobileSidebar())}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
