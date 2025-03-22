import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import usePermissions from '../../../hooks/usePermissions';
import Spinner from '../../common/Spinner';

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasRole, loading: permissionsLoading } = usePermissions();
  const location = useLocation();

  // Attendre que l'authentification et les permissions soient chargées
  if (isLoading || permissionsLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en conservant la page d'origine
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier le rôle si nécessaire
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Vérifier les permissions si nécessaire
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;