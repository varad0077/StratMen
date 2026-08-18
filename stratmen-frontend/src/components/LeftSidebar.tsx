import React from 'react';
import { Rss, Bookmark, FileText, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
import { User, FeedFilter } from '../types';

interface LeftSidebarProps {
  currentUser: User;
  postsCount: number;
  likesReceived: number;
  bookmarkedCount: number;
  activeFilter: FeedFilter;
  onSelectFilter: (filter: FeedFilter) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  postsCount,
  likesReceived,
  bookmarkedCount,
  activeFilter,
  onSelectFilter
}) => {
  return (
    <aside className="left-sidebar">
      {/* LinkedIn-Style Professional Profile Hero Card */}
      <div className="card user-profile-card">
        <div className="profile-card-cover" />
        <div className="profile-card-body">
          <div className="profile-avatar-wrapper">
            <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
            <span className="profile-online-badge" />
          </div>

          <div className="profile-info">
            <h3 className="profile-name">
              <span>{currentUser.name}</span>
              <CheckCircle2 size={16} className="verified-badge-icon" />
            </h3>
            <div className="profile-role-badge">
              <Sparkles size={12} />
              <span>{currentUser.role}</span>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <span className="stat-num">{postsCount}</span>
              <span className="stat-label">Updates</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat-item">
              <span className="stat-num">{likesReceived}</span>
              <span className="stat-label">Reactions</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat-item">
              <span className="stat-num">{bookmarkedCount}</span>
              <span className="stat-label">Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Feed Navigation Card */}
      <div className="card sidebar-nav-card">
        <div className="sidebar-section-title">
          <Rss size={16} />
          <span>Feed Navigation</span>
        </div>

        <div className="sidebar-nav-list">
          <button
            type="button"
            className={`sidebar-nav-item ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectFilter('ALL')}
          >
            <FileText size={18} />
            <span>All Updates</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeFilter === 'SAVED' ? 'active' : ''}`}
            onClick={() => onSelectFilter('SAVED')}
          >
            <Bookmark size={18} />
            <span>Saved Posts</span>
            {bookmarkedCount > 0 && <span className="nav-badge">{bookmarkedCount}</span>}
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeFilter === 'MY_POSTS' ? 'active' : ''}`}
            onClick={() => onSelectFilter('MY_POSTS')}
          >
            <UserCheck size={18} />
            <span>My Posts</span>
            {postsCount > 0 && <span className="nav-badge">{postsCount}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
