import React from 'react';
import { Users, CheckCircle2, Shield } from 'lucide-react';
import { AllowedUser } from '../data/allowlist';
import { User } from '../types';

interface RightSidebarProps {
  allowlist: AllowedUser[];
  totalPostsCount: number;
  currentUser?: User | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ allowlist = [], currentUser }) => {
  const safeList = Array.isArray(allowlist) ? allowlist : [];

  return (
    <aside className="right-sidebar">
      {/* Verified Members Directory */}
      <div className="card members-roster-card">
        <div className="sidebar-section-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
          <Users size={18} style={{ color: 'var(--brand-lime)' }} />
          <span>Verified Members ({safeList.length})</span>
        </div>

        <div className="members-list">
          {safeList.map((m) => {
            if (!m || !m.email) return null;

            const isSelf = Boolean(
              currentUser &&
              ((currentUser.email && m.email && m.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                m.name === currentUser.name)
            );
            const displayName = isSelf && currentUser ? currentUser.name : m.name || 'Member';
            const avatarUrl = isSelf && currentUser ? currentUser.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

            return (
              <div key={m.email} className="member-item">
                <div className="member-avatar-wrapper">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="member-avatar"
                  />
                  <span className="member-online-dot" />
                </div>

                <div className="member-details">
                  <div className="member-name-row">
                    <span className="member-name">{displayName}</span>
                    <CheckCircle2 size={13} style={{ color: 'var(--brand-lime)' }} />
                    {m.isAdmin && (
                      <span title="StratChat Admin" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Shield size={13} style={{ color: 'var(--brand-lime)' }} />
                      </span>
                    )}
                  </div>
                  <span className="member-role">{m.role || 'Member'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
