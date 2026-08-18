import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Zap, Lock, LogIn, Mail, Send } from 'lucide-react';
import { StratMenLogo } from './StratMenLogo';
import { AllowedUser, isEmailAllowed } from '../data/allowlist';
import { User } from '../types';
import { signInWithGoogle } from '../firebase';

interface LoginPageProps {
  allowlist: AllowedUser[];
  onLoginSuccess: (user: User, isAdmin: boolean) => void;
  onRegisterUser?: (newUser: AllowedUser) => void;
  /** When true, strips outer hero wrapper for use inside a compact container */
  compact?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ allowlist, onLoginSuccess, onRegisterUser, compact = false }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Register Request Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState('Member');

  // Handle Google Gmail Sign In
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const googleData = await signInWithGoogle();
      const cleanEmail = googleData.email.trim().toLowerCase();

      let matchedUser = isEmailAllowed(cleanEmail, allowlist);

      if (matchedUser) {
        const authUser: User = {
          id: `u-${Date.now()}`,
          name: googleData.name || matchedUser.name,
          role: matchedUser.role,
          avatar: googleData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matchedUser.name)}`
        };
        onLoginSuccess(authUser, matchedUser.isAdmin || false);
      } else {
        setErrorMsg(`Account "${cleanEmail}" is not registered on the roster. Click "Request Registration" to send a join request to the admin!`);
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        setErrorMsg('Firebase API Key missing or invalid. Please check your credentials.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google login popup was closed before completing authentication.');
      } else {
        setErrorMsg(err.message || 'Google Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Request Registration (Sends Email to Admin)
  const handleRequestRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpEmail.trim() || !signUpName.trim()) {
      setErrorMsg('Please provide both your full name and email address.');
      return;
    }

    const cleanEmail = signUpEmail.trim().toLowerCase();
    const name = signUpName.trim();
    const role = signUpRole;

    // Register user in local allowlist for immediate authorization
    const newUser: AllowedUser = {
      email: cleanEmail,
      name,
      role,
      isAdmin: false
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    }

    // Open Mailto link to send registration email to Admin
    const adminEmail = 'castilinox890@gmail.com';
    const subject = encodeURIComponent(`StratChat Member Registration Request: ${name}`);
    const body = encodeURIComponent(
      `Hello StratChat Admin,\n\nI would like to register for access to StratChat.\n\nMember Name: ${name}\nEmail Address: ${cleanEmail}\nRequested Role: ${role}\n\nPlease authorize my account on the StratChat roster.`
    );

    window.open(`mailto:${adminEmail}?subject=${subject}&body=${body}`, '_blank');

    setSuccessMsg(`Registration request prepared! An email draft to ${adminEmail} has been launched. You can now sign in with Google Gmail (${cleanEmail}).`);
  };

  const cardContent = (
    <div className="login-card">
      {/* Brand Header */}
      <div className="login-brand-header">
        <div className="login-logo-glow">
          <StratMenLogo size="lg" showSubtitle={false} />
        </div>
        <h1 className="login-title">StratChat</h1>
        <p className="login-subtitle" style={{ textTransform: 'lowercase', color: 'var(--brand-lime)' }}>
          stratmen foundation • private member portal
        </p>
      </div>

      {/* Navigation Tabs (Gmail Sign In / Register Request) */}
      <div
        className="login-auth-tabs"
        style={{
          display: 'flex',
          gap: 6,
          background: 'var(--bg-input)',
          padding: 4,
          borderRadius: 'var(--radius-full)',
          margin: '16px 0 20px 0',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <button
          type="button"
          className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('signin');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeTab === 'signin' ? 'var(--brand-lime)' : 'transparent',
            color: activeTab === 'signin' ? '#090c15' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease'
          }}
        >
          <LogIn size={15} />
          <span>Sign In (Gmail)</span>
        </button>

        <button
          type="button"
          className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('register');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeTab === 'register' ? 'var(--brand-lime)' : 'transparent',
            color: activeTab === 'register' ? '#090c15' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease'
          }}
        >
          <Mail size={15} />
          <span>Register Request</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="login-error-alert" style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} className="error-icon" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="login-success-alert" style={{ marginBottom: 16, background: 'var(--brand-lime-light)', border: '1px solid var(--brand-lime-border)', color: 'var(--brand-lime)', padding: 12, borderRadius: 12, fontSize: '0.84rem', lineHeight: 1.45 }}>
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: GMAIL SIGN IN */}
      {activeTab === 'signin' && (
        <div className="auth-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Sign in with your authorized Google Gmail account to access StratChat.
          </p>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="google-login-btn"
            style={{ width: '100%', padding: '14px 20px', margin: '8px 0' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Authenticating Gmail...' : 'Sign In with Gmail'}</span>
          </button>
        </div>
      )}

      {/* TAB 2: REGISTER REQUEST (EMAIL TO ADMIN) */}
      {activeTab === 'register' && (
        <div className="auth-tab-content">
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Not yet registered on the roster? Submit your details to send a registration email to the admin.
          </p>

          <form onSubmit={handleRequestRegistration} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              className="comment-input"
              placeholder="Full Name (e.g. Alex Rivera)..."
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              style={{ borderRadius: 'var(--radius-md)', padding: '12px 16px' }}
              required
            />

            <input
              type="email"
              className="comment-input"
              placeholder="Email Address (Gmail)..."
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              style={{ borderRadius: 'var(--radius-md)', padding: '12px 16px' }}
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select Role:</label>
              <select
                value={signUpRole}
                onChange={(e) => setSignUpRole(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="Founder">Founder</option>
                <option value="Lead">Lead</option>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px', borderRadius: 'var(--radius-full)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}
            >
              <span>Send Registration Request</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Footer info */}
      <div className="login-footer-note" style={{ marginTop: 24 }}>
        <Lock size={12} />
        <span>Protected by Google Authentication & StratMen Security</span>
      </div>
    </div>
  );

  if (compact) {
    return cardContent;
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-page-container">
        {/* Left Column: Hero Branding */}
        <div className="login-hero-section">
          <div className="login-hero-badge">
            <ShieldCheck size={16} />
            <span>StratMen Foundation Official Portal</span>
          </div>

          <h1 className="login-hero-title">
            Strategic Collaboration with <span>StratChat</span>
          </h1>

          <p className="login-hero-desc">
            The official private communication network built for StratMen Founders, Leads, and Members to share strategic updates and drive impact.
          </p>

          <div className="login-features-list">
            <div className="login-feature-card">
              <div className="login-feature-icon">
                <Zap size={20} />
              </div>
              <div className="login-feature-text">
                <h4>Real-Time Executive Feed</h4>
                <p>Share strategic updates, announcements, and impact reports directly with foundation leadership.</p>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="login-feature-text">
                <h4>Verified Roster & Access Control</h4>
                <p>Connect securely with verified Founders, Leads, and Members on a protected portal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        {cardContent}
      </div>
    </div>
  );
};
