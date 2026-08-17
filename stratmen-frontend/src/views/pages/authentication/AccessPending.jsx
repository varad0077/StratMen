import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { logout } from '@/services/authService';
import { toast } from 'sonner';

export const AccessPending = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/stratchat');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-warm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-white rounded-xl border border-border-subtle shadow-modal p-8 text-center space-y-6">
        <div className="flex justify-center">
          <Logo size="lg" className="justify-center" />
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning mx-auto border border-warning/30">
          <Clock className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-text-dark font-heading">
            Access Pending Approval
          </h1>
          <p className="text-sm text-text-mid leading-relaxed">
            Your account (<span className="font-medium text-text-dark">{user?.email || 'authenticated'}</span>) is not yet listed on the StratChat allowlist.
          </p>
        </div>

        <div className="bg-bg-warm p-4 rounded-lg border border-border-subtle text-sm text-text-mid space-y-2 text-left">
          <p>
            If you have submitted a Join Application, our admin team is reviewing your details. You will receive access once approved.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
            <Mail className="h-3.5 w-3.5 text-green-deep" />
            <span>Contact Support: contact@stratmen.org</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate('/')} className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Button>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};
