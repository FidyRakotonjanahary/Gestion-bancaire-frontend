// src/hooks/usePermissions.js
import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import api from '../services/api';

const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isAuthenticated || !user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        // Récupérer les permissions depuis l'API
        const response = await api.get(`/users/${user.id}/permissions`);
        
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
  }, [user, isAuthenticated]);

  const hasPermission = (permissionName) => {
    // L'administrateur a toutes les permissions
    if (user && user.role_id === 1) return true;
    
    // Vérifier dans les permissions de l'utilisateur
    return permissions.some(p => 
      p.permission_name === permissionName && p.is_granted
    );
  };

  return {
    permissions,
    loading,
    hasPermission
  };
};

export default usePermissions;