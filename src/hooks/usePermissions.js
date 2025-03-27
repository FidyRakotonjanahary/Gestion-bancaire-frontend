import { useEffect, useState, useCallback } from 'react';
import useAuth from './useAuth';
import api from '../services/api';
import { permissionService } from '../services/permissionService';

const usePermissions = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les permissions uniquement quand l'utilisateur est authentifié
  useEffect(() => {
    const fetchPermissions = async () => {
      // Réinitialiser l'état
      setLoading(true);
      setError(null);
      
      // Condition plus stricte pour vérifier l'authentification
      if (!isAuthenticated || !user || !token) {
        console.log('Debug - Authentification incomplète:', { 
          isAuthenticated, 
          userExists: !!user, 
          tokenExists: !!token 
        });
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await api.get(`/users/${user.id}/permissions`, config);
        
        if (response.data.success) {
          console.log('Permissions récupérées:', response.data.data);
          setPermissions(response.data.data || []);
        } else {
          console.log('Échec de récupération des permissions');
          setPermissions([]);
        }
      } catch (error) {
        console.error('Erreur de récupération des permissions:', error);
        setError('Impossible de récupérer les permissions');
        setPermissions([]);
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
  // Charger toutes les permissions
  const loadAllPermissions = useCallback(async () => {
    if (!isAuthenticated) {
      console.error('Impossible de récupérer les permissions - non authentifié');
      setError('Non authentifié');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.getAllPermissions();
      setPermissions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des permissions');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Charger les permissions d'un utilisateur
  const loadUserPermissions = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.getUserPermissions(userId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des permissions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour les permissions d'un utilisateur
  const updateUserPermissions = useCallback(async (userId, permissionsData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.updateUserPermissions(userId, permissionsData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour des permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialiser les permissions d'un utilisateur
  const resetUserPermissions = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.resetUserPermissions(userId);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation des permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger l'historique des permissions
  const loadPermissionHistory = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.getPermissionHistory(userId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);



  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasRole,
    loadAllPermissions,
    loadUserPermissions,
    updateUserPermissions,
    resetUserPermissions,
    loadPermissionHistory
  };
};

export default usePermissions;