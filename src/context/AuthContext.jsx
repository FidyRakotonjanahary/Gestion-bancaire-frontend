import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AUTH_TOKEN_KEY = 'auth_token';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial user check on component mount
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Silent failure, user will be redirected if needed
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialAuth();
  }, []);

  // Logout stable memoized
  const logout = useCallback(async (navigateToLogin = true) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (navigateToLogin) {
        navigate('/login', { replace: true });
      }
    }
  }, [navigate]);

  const login = useCallback(async (credentials) => {
    try {
      const result = await authService.login(credentials);
      
      if (!result.success) {
        toast.error(result.message);
        return { success: false };
      }

      setUser(result.user);
      setIsAuthenticated(true);
      
      return { 
        success: true,
        user: result.user
      };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Vérification des permissions
  const checkPermission = useCallback((permissionName) => {
    if (!user) return false;
    if (user.role_id === 1 || user.role === 'ADMIN') return true;
    
    if (user.permissions) {
      if (Array.isArray(user.permissions)) {
        return user.permissions.includes(permissionName);
      }
      if (typeof user.permissions === 'string') {
        return user.permissions.split(',').includes(permissionName);
      }
      if (typeof user.permissions === 'object') {
        return user.permissions[permissionName] === true;
      }
    }
    return false;
  }, [user]);

  // Vérification des rôles
  const hasRole = useCallback((roleName) => {
    if (!user) return false;
    
    if (typeof user.role === 'number') {
      const roleMap = {
        1: 'ADMIN',
        2: 'USER'
      };
      return roleMap[user.role_id] === roleName;
    }
    
    if (typeof user.role === 'string') {
      return user.role.toUpperCase() === roleName.toUpperCase();
    }
    
    return false;
  }, [user]);

  // Mémorisation des valeurs du contexte
  const contextValue = React.useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkPermission,
    hasRole,
    userId: user?.id,
    token: user?.token || authService.getToken(),
    userRole: user?.role || (user?.role_id === 1 ? 'ADMIN' : 'USER'),
    userPermissions: user?.permissions || []
  }), [user, isAuthenticated, isLoading, login, logout, checkPermission, hasRole]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};