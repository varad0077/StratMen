import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, MessageSquare, User, Shield, X } from 'lucide-react';
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
    <div className="flex flex-col h-full space-y-5">
      {/* Profile summary card */}
      <div className="p-4 rounded-xl bg-green-soft flex items-center gap-3">
        <UserAvatar
          src={profile?.avatar_url || user?.user_metadata?.avatar_url}
          name={displayName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-dark truncate">{displayName}</h4>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
          <Badge
            variant={isAdmin ? 'admin' : 'default'}
            className="mt-1 text-[10px]"
          >
            {roleName}
          </Badge>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-0.5 flex-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative',
                  isActive
                    ? item.isAdmin
                      ? 'bg-green-soft text-green-deep font-semibold border border-green-deep/20'
                      : 'bg-green-soft text-green-deep font-semibold'
                    : 'text-text-mid hover:text-text-dark hover:bg-green-soft/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-green-deep rounded-full" />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                  {item.isAdmin && !navItems.find((n) => n.path === item.path && false) && (
                    <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-green-deep" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Community tagline footer */}
      <div className="p-3 rounded-lg border border-border-subtle bg-bg-warm text-xs text-text-muted flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-green-deep shrink-0" />
        <span>Building strategic leaders together.</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 p-4 border-r border-border-subtle bg-bg-white min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-text-dark/30 backdrop-blur-sm"
            onClick={() => dispatch(closeMobileSidebar())}
          />
          <div className="relative z-10 w-64 bg-bg-white border-r border-border-subtle p-4 flex flex-col h-full animate-slide-up shadow-modal">
            <button
              onClick={() => dispatch(closeMobileSidebar())}
              className="absolute top-4 right-4 text-text-muted hover:text-text-dark p-1 cursor-pointer"
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
