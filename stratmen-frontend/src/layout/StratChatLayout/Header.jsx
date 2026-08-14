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
      toast.error('Failed to log out');
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Member';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-surface-dark/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleMobileSidebar())}
          className="lg:hidden text-text-secondary hover:text-text-primary p-1 cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Logo to="/stratchat/feed" />
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <UserAvatar
            src={profile?.avatar_url || user?.user_metadata?.avatar_url}
            name={displayName}
            size="sm"
          />
          <span className="hidden md:inline text-sm font-medium text-text-primary max-w-[150px] truncate">
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
