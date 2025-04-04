import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import usePermissions from '../../../hooks/usePermissions';
import Spinner from '../../common/Spinner';

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { hasPermission, hasRole, loading: isPermissionLoading } = usePermissions();
  const location = useLocation();

  // Affichage du spinner pendant le chargement de l'authentification
  if (isAuthLoading) {
    return <Spinner />;
  }

  // Redirection vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Affichage du spinner pendant le chargement des permissions uniquement
  // si nous sommes authentifiés et qu'une vérification de permission est nécessaire
  if (isPermissionLoading && (requiredPermission || requiredRole)) {
    return <Spinner />;
  }

  // Vérification du rôle si un rôle requis est spécifié
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Vérification des permissions si une permission requise est spécifiée
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Affichage du contenu si toutes les vérifications sont passées
  return children;
};

export default ProtectedRoute;