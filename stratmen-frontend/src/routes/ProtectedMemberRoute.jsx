import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageLoader } from '@/components/Loader';

export const ProtectedMemberRoute = ({ children }) => {
  const { isAuthenticated, isAllowlisted, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Verifying StratChat membership access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/stratchat" state={{ from: location }} replace />;
  }

  if (!isAllowlisted) {
    return <Navigate to="/access-pending" replace />;
  }

  return children;
};
