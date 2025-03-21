// src/services/authService.js
import api from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - {username, password}
   * @returns {Promise} - Données utilisateur et token
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      api.setAuthHeader(token);
    }
    return response.data;
  },

  /**
   * Inscription utilisateur
   * @param {Object} userData - {username, email, password}
   * @returns {Promise} - Données utilisateur et token
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      api.setAuthHeader(token);
    }
    return response.data;
  },

  /**
   * Déconnexion
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      api.removeAuthHeader();
    }
  },

  /**
   * Récupérer l'utilisateur actuel
   * @returns {Promise} - Données utilisateur
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  /**
   * Récupérer l'historique de connexion
   * @returns {Promise} - Historique de connexion
   */
  getLoginHistory: async () => {
    const response = await api.get('/auth/login-history');
    return response.data.data;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {Boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Récupérer les données utilisateur stockées
   * @returns {Object|null}
   */
  getStoredUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Récupérer le token d'authentification
   * @returns {String|null}
   */
  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
};

export default authService;