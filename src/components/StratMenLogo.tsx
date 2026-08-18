import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onIconClick?: () => void;
  onTitleClick?: () => void;
}

export const StratMenLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onIconClick,
  onTitleClick
}) => {
  const dimension = size === 'sm' ? 48 : size === 'md' ? 60 : 90;

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTitleClick) {
      onTitleClick();
    } else {
      window.location.reload();
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onIconClick) {
      onIconClick();
    }
  };

  return (
    <div className={`logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {/* Clickable Logo Icon (Opens image lightbox) */}
      <img
        src="/logo.png"
        alt="StratMen Strategic Mentoring Logo"
        onClick={handleIconClick}
        title="Click to view official StratMen logo image"
        style={{
          width: dimension,
          height: dimension,
          borderRadius: '50%',
          objectFit: 'contain',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'transform 0.2s ease, filter 0.2s ease'
        }}
        className="logo-icon-container"
      />

      {/* Clickable Title & Subtitle (Refreshes page) */}
      {showSubtitle && (
        <div
          className="brand-title-group"
          onClick={handleTitleClick}
          title="Click to refresh StratChat feed"
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.15,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <span
            className="brand-title-text"
            style={{
              fontSize: size === 'sm' ? '1.35rem' : size === 'md' ? '1.55rem' : '2.0rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.4px'
            }}
          >
            StratChat
          </span>
          <span
            className="brand-subtitle-text"
            style={{
              fontSize: size === 'sm' ? '0.78rem' : size === 'md' ? '0.84rem' : '0.95rem',
              fontWeight: 600,
              color: 'var(--brand-lime)',
              textTransform: 'lowercase',
              letterSpacing: '0.3px'
            }}
          >
            stratmen foundation
          </span>
        </div>
      )}
    </div>
  );
};
