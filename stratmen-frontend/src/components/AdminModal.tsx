import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Shield, Check, Search } from 'lucide-react';
import { AllowedUser } from '../data/allowlist';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowlist: AllowedUser[];
  onAddUser: (newUser: AllowedUser) => void;
  onRemoveUser: (email: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  allowlist,
  onAddUser,
  onRemoveUser
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Member');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmRevokeEmail, setConfirmRevokeEmail] = useState<string | null>(null);

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

  if (!isOpen) return null;

  const roles = [
    'Founder',
    'Lead',
    'Member',
    'Admin'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const isUserAdmin = newRole.toLowerCase().includes('admin');

    onAddUser({
      email: newEmail.trim().toLowerCase(),
      name: newName.trim(),
      role: isUserAdmin ? 'StratChat Admin' : newRole.trim(),
      isAdmin: isUserAdmin
    });

    setSuccessMsg(`Added ${newEmail.trim()} (${newRole}) to StratMen access list.`);
    setNewEmail('');
    setNewName('');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const safeList = Array.isArray(allowlist) ? allowlist : [];
  const filteredMembers = safeList.filter(
    (u) =>
      u &&
      ((u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content admin-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Shield size={24} style={{ color: 'var(--brand-lime)' }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Member Access Control</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              StratMen Foundation Authorized Access List ({allowlist.length} Verified Members)
            </p>
          </div>
        </div>

        {/* Add Member Form */}
        <form onSubmit={handleAddSubmit} className="admin-add-form">
          <div className="admin-form-header">
            <UserPlus size={15} style={{ color: 'var(--brand-lime)' }} />
            <span>Authorize New Member Access</span>
          </div>

          <div className="admin-form-inputs">
            <input
              type="email"
              required
              placeholder="Gmail Address (e.g. member@gmail.com)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="comment-input"
            />
            <input
              type="text"
              required
              placeholder="Member Name (e.g. Rahul Kapoor)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="comment-input"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="role-select-input"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  Role: {r}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px 12px' }}>
            <span>Authorize Member Access</span>
          </button>

          {successMsg && (
            <div className="admin-success-msg">
              <Check size={14} />
              <span>{successMsg}</span>
            </div>
          )}
        </form>

        {/* Member Search & List */}
        <div className="admin-list-header">
          <span className="admin-list-title">Authorized Member Directory</span>
          <div className="admin-search-wrapper">
            <Search size={14} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Filter members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        <div className="admin-member-list">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((u) => (
              <div key={u.email} className="admin-member-row">
                <div className="admin-member-info">
                  <div className="admin-member-name">
                    <span>{u.name}</span>
                    {u.isAdmin && <span className="admin-shield-icon" title="Admin">🛡️</span>}
                  </div>
                  <div className="admin-member-sub">
                    {u.email} • <span className="badge badge-lime" style={{ fontSize: '0.68rem' }}>{u.role}</span>
                  </div>
                </div>

                {!u.isAdmin && (
                  confirmRevokeEmail === u.email ? (
                    <div className="revoke-confirm-group">
                      <span className="revoke-ask">Revoke?</span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm-danger"
                        onClick={() => {
                          onRemoveUser(u.email);
                          setConfirmRevokeEmail(null);
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm-cancel"
                        onClick={() => setConfirmRevokeEmail(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmRevokeEmail(u.email)}
                      className="btn btn-ghost delete-member-btn"
                      title="Revoke member access"
                    >
                      <Trash2 size={15} />
                    </button>
                  )
                )}
              </div>
            ))
          ) : (
            <div className="admin-no-results">
              No authorized members matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
