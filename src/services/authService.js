import apiService from './api';
import * as jwtDecode from 'jwt-decode';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

const authService = {
  login : async (credentials) => {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        apiService.setAuthHeader(token);
        
        return {
          success: true,
          user: user
        };
      } else {
        // Gestion des cas où la connexion échoue côté serveur
        return {
          success: false,
          message: 'Identifiants invalides'
        };
      }
    } catch (error) {
      // En cas d'erreur (401, réseau, etc.)
      return {
        success: false,
        message: 'Identifiants invalides'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        apiService.setAuthHeader(token);
        
        return response.data;
      }
      
      throw new Error(response.data.message || 'Échec de l\'inscription');
    } catch (error) {
      console.error('Erreur d\'inscription :', error.response?.data || error.message);
      throw error;
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      console.log('Aucun token de rafraîchissement disponible');
      await this.logout();
      return false;
    }

    try {
      const response = await apiService.post('/auth/refresh-token', { refreshToken });
      
      if (response.data.success) {
        const { token, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        
        apiService.setAuthHeader(token);
        return true;
      }
      
      // Si le refresh token est invalide, déconnexion
      await this.logout();
      return false;
    } catch (error) {
      console.error('Erreur de rafraîchissement du token :', error);
      await this.logout();
      return false;
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    try {
      // Seulement tenter la déconnexion si un refresh token existe
      if (refreshToken) {
        await apiService.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Log l'erreur mais ne bloque pas la déconnexion
      console.warn('Erreur lors de la déconnexion :', error);
    } finally {
      // Nettoyer toujours le stockage local
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      apiService.removeAuthHeader();
      
      // Navigation vers la page de connexion
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!token || !authService.isTokenValid()) {
      await authService.logout();
      return null;
    }
  
    try {
      const response = await apiService.get('/auth/me');
      return response.data.success ? response.data.data.user : null;
    } catch (error) {
      console.error('Erreur de récupération de l\'utilisateur :', error);
      await authService.logout();
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? authService.isTokenValid() : false;
  },

  getStoredUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isTokenValid: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = jwtDecode.jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Vérifier l'expiration avec une marge de 30 secondes
      return decoded.exp > (currentTime + 30);
    } catch (error) {
      console.error('Token invalide :', error);
      return false;
    }
  },
};

export default authService;