import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PageLoader from './PageLoader';

const AuthGuard = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children ? children : <Outlet />;
};

export default AuthGuard;