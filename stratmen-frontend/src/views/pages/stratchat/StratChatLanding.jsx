import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { loginWithEmail, loginWithGoogle, getUserProfile } from '@/services/authService';
import { submitApplication } from '@/services/joinRequestService';
import { checkAllowlist } from '@/services/allowlistService';
import { setSession, setProfile, setAllowlistStatus } from '@/store/authSlice';
import { toast } from 'sonner';

// Zod Schema for Join Us embedded application
const joinSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number').max(15),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  reason: z.string().min(20, 'Reason must be at least 20 characters').max(500),
});

export const StratChatLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isAllowlisted } = useSelector((state) => state.auth);

  // Auto-redirect already logged-in & allowlisted members directly to feed
  useEffect(() => {
    if (isAuthenticated && isAllowlisted) {
      navigate('/stratchat/feed', { replace: true });
    }
  }, [isAuthenticated, isAllowlisted, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Application form submission state
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(joinSchema),
  });

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoginLoading(true);
      const data = await loginWithEmail(loginEmail, loginPassword);
      if (data?.session && data?.user) {
        dispatch(setSession(data.session));

        try {
          const profile = await getUserProfile(data.user.id);
          if (profile) dispatch(setProfile(profile));
        } catch (pErr) {
          console.error('Profile load error:', pErr);
        }

        const allowlistStatus = await checkAllowlist(data.user.email);
        dispatch(setAllowlistStatus(allowlistStatus));

        if (allowlistStatus.isAllowed) {
          toast.success('Welcome back to StratChat!');
          navigate('/stratchat/feed', { replace: true });
        } else {
          navigate('/access-pending', { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to initiate Google OAuth.');
      setGoogleLoading(false);
    }
  };

  // Handle Join Application Submission
  const onJoinSubmit = async (formData) => {
    try {
      setAppLoading(true);
      await submitApplication(formData);
      setAppSubmitted(true);
      toast.success('Application submitted successfully!');
      reset();
    } catch (error) {
      console.error('Application submit error:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-warm flex flex-col justify-center py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[460px] w-full mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <Logo size="lg" className="justify-center" />
          <div className="pt-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-dark">
              Welcome to <span className="text-green-mint">StratChat</span>
            </h1>
            <p className="text-sm text-text-mid mt-1.5">
              The private community hub for StratMen leaders.
            </p>
          </div>
        </div>

        {/* ── 1. LOG IN SECTION ── */}
        <div className="bg-bg-white rounded-xl border border-border-subtle shadow-card p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-dark flex items-center gap-2 font-heading">
              <LogIn className="h-4 w-4 text-green-deep" />
              Log In to StratChat
            </h2>
            <p className="text-xs text-text-muted">
              Authenticated &amp; allowlisted members log in below.
            </p>
          </div>

          {/* Google OAuth Button */}
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-11 font-medium flex items-center justify-center gap-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <span className="w-full border-t border-border-subtle" />
            <span className="absolute bg-bg-white px-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              or email
            </span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-semibold text-text-dark">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="user@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-xs font-semibold text-text-dark">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loginLoading} className="w-full h-10 font-semibold">
              {loginLoading ? 'Authenticating...' : 'Log In to StratChat'}
            </Button>
          </form>
        </div>

        {/* Divider label */}
        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-border-subtle" />
          <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">
            New to StratChat?
          </span>
          <span className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* ── 2. JOIN APPLICATION FORM ── */}
        <div className="bg-bg-white rounded-xl border border-border-subtle shadow-card p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-text-dark flex items-center gap-2 font-heading">
              <ArrowRight className="h-4 w-4 text-green-deep" />
              Apply to Join StratChat
            </h2>
            <p className="text-xs text-text-muted">
              Fill out the form below. Once approved by an admin, you'll gain full access.
            </p>
          </div>

          {appSubmitted ? (
            <div className="p-6 text-center space-y-3 bg-green-soft rounded-xl border border-border-subtle animate-fade-in">
              <CheckCircle2 className="h-10 w-10 text-green-deep mx-auto" />
              <h4 className="text-base font-bold text-text-dark font-heading">Application Received!</h4>
              <p className="text-sm text-text-mid">
                Thank you for applying. Our admin team will review your application and send an email once approved.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAppSubmitted(false)}
                className="mt-2"
              >
                Submit Another Application
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onJoinSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-xs font-semibold text-text-dark">Full Name *</Label>
                <Input id="full_name" placeholder="John Doe" {...register('full_name')} />
                {errors.full_name && (
                  <p className="text-xs text-danger">{errors.full_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-text-dark">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
                  {errors.email && (
                    <p className="text-xs text-danger">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-text-dark">Phone Number *</Label>
                  <Input id="phone" placeholder="9876543210" {...register('phone')} />
                  {errors.phone && (
                    <p className="text-xs text-danger">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="linkedin_url" className="text-xs font-semibold text-text-dark">LinkedIn Profile URL (Optional)</Label>
                <Input id="linkedin_url" placeholder="https://linkedin.com/in/johndoe" {...register('linkedin_url')} />
                {errors.linkedin_url && (
                  <p className="text-xs text-danger">{errors.linkedin_url.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason" className="text-xs font-semibold text-text-dark">Why do you want to join StratChat? *</Label>
                <Textarea
                  id="reason"
                  rows={3}
                  placeholder="Tell us about your background and goals..."
                  {...register('reason')}
                />
                {errors.reason && (
                  <p className="text-xs text-danger">{errors.reason.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={appLoading}
                className="w-full h-10 font-semibold"
              >
                <Send className="h-4 w-4" />
                {appLoading ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
