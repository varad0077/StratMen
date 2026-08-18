import React from 'react';
import { LogOut, Shield, Moon, Sun } from 'lucide-react';
import { StratMenLogo } from './StratMenLogo';

interface HeaderProps {
  isAdmin: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAdminModal: () => void;
  onOpenLogoModal?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  theme,
  onToggleTheme,
  onOpenAdminModal,
  onOpenLogoModal,
  onLogout
}) => {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* Brand Section */}
        <div className="brand-section">
          <StratMenLogo
            size="md"
            showSubtitle={true}
            onIconClick={onOpenLogoModal}
            onTitleClick={() => window.location.reload()}
          />
        </div>

        {/* Header Actions & Controls */}
        <div className="header-actions">

          {/* 2. Admin Control Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="btn btn-secondary admin-access-btn"
              title="Manage Approved Member Roster"
            >
              <Shield size={18} className="shield-icon" />
              <span>Access Control</span>
            </button>
          )}

          {/* 3. Theme Switcher (Dark / Light) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* 4. Sign Out Button */}
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-ghost logout-btn"
            title="Sign out of StratChat"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
