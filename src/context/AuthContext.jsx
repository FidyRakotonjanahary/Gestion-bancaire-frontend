// src/context/AuthContext.jsx
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
    // Cette fonction pourrait être étendue pour vérifier les permissions utilisateur
    // Pour l'instant, on vérifie simplement si l'utilisateur est admin
    if (!user) return false;
    
    // Admin a toutes les permissions
    if (user.role_id === 1) return true;
    
    // Vous pourriez implémenter une vérification plus détaillée des permissions ici
    // en utilisant un service dédié ou des données stockées
    return false;
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
        checkPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};