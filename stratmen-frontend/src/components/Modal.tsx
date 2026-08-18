import React, { ReactNode, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  /** If true, clicking outside the modal content will call onClose */
  dismissOnOutsideClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  dismissOnOutsideClick = true
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only dismiss if the click was directly on the overlay, not inside content
      if (dismissOnOutsideClick && contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [dismissOnOutsideClick, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={overlayStyle} onClick={handleOverlayClick}>
      <div className="modal-content" ref={contentRef} style={contentStyle}>
        <div className="modal-header" style={headerStyle}>
          {title && <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            style={closeBtnStyle}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body" style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(10, 14, 24, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
};

const contentStyle: React.CSSProperties = {
  background: 'var(--bg-card, #111827)',
  borderRadius: 'var(--radius-lg, 16px)',
  width: '92%',
  maxWidth: '440px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(132,204,22,0.08)',
  border: '1px solid rgba(132,204,22,0.12)',
  padding: 0,
  animation: 'modalSlideIn 0.25s ease-out',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
};

const closeBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '50%',
  cursor: 'pointer',
  color: 'var(--text-secondary, #9ca3af)',
  padding: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

const bodyStyle: React.CSSProperties = {
  padding: '20px',
};
