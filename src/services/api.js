import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Limiter le nombre de tentatives de rafraîchissement
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 2;

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token && authService.isTokenValid()) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Conditions de rafraîchissement du token
    const is401Or403 = [401, 403].includes(error.response?.status);
    const isNotRetried = !originalRequest._retry;

    if (is401Or403 && isNotRetried && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
      originalRequest._retry = true;
      refreshAttempts++;

      try {
        const refreshResult = await authService.refreshToken();
        
        if (refreshResult) {
          // Réinitialiser les tentatives après un succès
          refreshAttempts = 0;
          return api(originalRequest);
        } else {
          // Déconnexion propre
          await authService.logout();
        }
      } catch (refreshError) {
        console.error('Erreur de rafraîchissement du token:', refreshError);
        await authService.logout();
      }
    }

    // Réinitialiser les tentatives si échec
    refreshAttempts = 0;
    return Promise.reject(error);
  }
);

const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  setAuthHeader: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  removeAuthHeader: () => {
    delete api.defaults.headers.common['Authorization'];
  },

  instance: api
};

export default apiService;