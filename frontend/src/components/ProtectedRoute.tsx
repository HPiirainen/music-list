import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  if (!user?.token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
