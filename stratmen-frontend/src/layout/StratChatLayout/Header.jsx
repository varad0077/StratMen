import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Menu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { UserAvatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logout } from '@/services/authService';
import { useDispatch } from 'react-redux';
import { toggleMobileSidebar } from '@/store/uiSlice';
import { toast } from 'sonner';

export const Header = () => {
  const { user, profile, isAdmin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Member';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border-subtle bg-bg-white px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleMobileSidebar())}
          className="lg:hidden text-text-mid hover:text-text-dark p-1 cursor-pointer transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Logo to="/stratchat/feed" />
      </div>

      <div className="flex items-center gap-3">
        {/* Admin badge */}
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-soft text-green-deep text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin</span>
          </div>
        )}

        {/* User info + logout */}
        <div className="flex items-center gap-2.5">
          <UserAvatar
            src={profile?.avatar_url || user?.user_metadata?.avatar_url}
            name={displayName}
            size="sm"
          />
          <span className="hidden md:inline text-sm font-medium text-text-dark max-w-[150px] truncate">
            {displayName}
          </span>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            title="Log out"
            className="text-text-muted hover:text-danger hover:bg-danger/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
