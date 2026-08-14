import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { logout } from '@/services/authService';

export const AccessPending = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await logout();
    navigate('/stratchat');
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 gradient-hero">
      <Card className="glass max-w-md w-full text-center p-6 space-y-6 border-warning/30">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning mx-auto border border-warning/30 animate-pulse">
          <Clock className="h-8 w-8" />
        </div>

        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-2xl font-bold text-text-primary">
            Access Pending Approval
          </CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Your account ({user?.email || 'authenticated'}) is not yet listed on the StratChat allowlist.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 text-sm text-text-muted space-y-3 bg-surface-elevated/50 p-4 rounded-lg border border-border">
          <p>
            If you have submitted a Join Application, our admin team is reviewing your details. You will receive access once approved.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary pt-2">
            <Mail className="h-4 w-4 text-accent" />
            <span>Contact Support: contact@stratmen.org</span>
          </div>
        </CardContent>

        <CardFooter className="p-0 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return Home
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full text-text-muted hover:text-text-primary">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
