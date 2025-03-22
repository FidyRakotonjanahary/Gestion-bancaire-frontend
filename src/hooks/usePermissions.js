import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import api from '../services/api';

const usePermissions = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isAuthenticated || !user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      // Si les permissions sont déjà dans l'objet utilisateur, les utiliser directement
      if (user.permissions && Array.isArray(user.permissions)) {
        setPermissions(user.permissions);
        setLoading(false);
        return;
      }

      try {
        // Configuration de l'en-tête d'autorisation avec le token JWT
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        // Récupérer les permissions depuis l'API
        const response = await api.get(`/users/${user.id}/permissions`, config);
        
        if (response.data.success) {
          setPermissions(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user, isAuthenticated, token]);

  const hasPermission = (permissionName) => {
    // L'administrateur a toutes les permissions
    if (user && (user.role_id === 1 || user.role === 'ADMIN')) return true;
    
    // Vérifier dans les permissions de l'utilisateur
    if (Array.isArray(permissions)) {
      // Si permissions est un tableau d'objets
      if (permissions.length > 0 && typeof permissions[0] === 'object') {
        return permissions.some(p => 
          p.permission_name === permissionName && p.is_granted
        );
      }
      // Si permissions est un tableau de chaînes de caractères
      return permissions.includes(permissionName);
    }
    
    return false;
  };

  const hasRole = (roleName) => {
    if (!user) return false;
    
    // Vérifier si l'utilisateur a le rôle spécifié
    if (roleName === 'ADMIN' && user.role_id === 1) return true;
    if (roleName === 'USER' && user.role_id === 2) return true;
    
    // Vérifier en utilisant la propriété role si disponible
    return user.role === roleName;
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasRole
  };
};

export default usePermissions;