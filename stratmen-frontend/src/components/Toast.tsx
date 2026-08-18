import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertCircle : Info;

        return (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <Icon size={18} className="toast-icon" />
            <span className="toast-text">{t.text}</span>
            <button
              type="button"
              className="toast-dismiss"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
