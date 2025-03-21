// src/services/api.js
import axios from 'axios';

// Créer une instance Axios avec la configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Rediriger vers la page de connexion si le token est invalide ou expiré
      if (error.response.data.reason === 'token_expired' || 
          error.response.data.message.includes('token')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Méthodes utilitaires
const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  // Méthodes pour gérer les headers d'authentification
  setAuthHeader: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  removeAuthHeader: () => {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default apiService;