import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageLoader } from '@/components/Loader';

export const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAllowlisted, isAdmin, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Verifying admin credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/stratchat" state={{ from: location }} replace />;
  }

  if (!isAllowlisted) {
    return <Navigate to="/access-pending" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/stratchat/feed" replace />;
  }

  return children;
};
