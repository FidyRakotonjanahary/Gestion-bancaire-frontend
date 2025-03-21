// src/components/features/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Spinner from '../../common/Spinner';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, isLoading, checkPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en conservant la page d'origine
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions si nécessaire
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;