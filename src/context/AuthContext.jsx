import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Récupérer les données utilisateur depuis le stockage local
          const storedUser = authService.getStoredUser();
          
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
            
            // Facultatif: vérifier la validité du token en récupérant les données utilisateur depuis l'API
            try {
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                setUser(currentUser);
              }
            } catch (error) {
              // Si l'API rejette la requête, déconnecter l'utilisateur
              await authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } catch (error) {
        console.error('Erreur d\'initialisation de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la connexion'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'inscription'
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkPermission = (permissionName) => {
    if (!user) return false;
    
    // Admin a toutes les permissions
    if (user.role_id === 1 || user.role === 'ADMIN') return true;
    
    // Vérifier dans les permissions de l'utilisateur si disponibles
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permissionName);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkPermission,
        hasRole,
        // Exposer directement les informations spécifiques demandées
        userId: user?.id,
        token: user?.token || authService.getToken(),
        userRole: user?.role || (user?.role_id === 1 ? 'ADMIN' : 'USER'),
        userPermissions: user?.permissions || []
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};