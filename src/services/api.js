import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Simplified token management
const tokenManager = {
  getAccessToken: () => localStorage.getItem('auth_token'),
  clearTokens: () => {
    localStorage.removeItem('auth_token');
  },
  isTokenValid: (token) => {
    if (!token) return false;
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < exp * 1000 - 30000; // 30s margin
    } catch {
      return false;
    }
  }
};

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token && tokenManager.isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { status } = error.response || {};

    // Si non autorisé, redirigez vers la connexion
    if ([401, 403].includes(status)) {
      tokenManager.clearTokens();
      window.location.href = `/login?reason=unauthorized&from=${encodeURIComponent(window.location.pathname)}`;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Méthodes de l'API
const apiService = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),

  setAuthHeader: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  removeAuthHeader: () => {
    delete api.defaults.headers.common['Authorization'];
  },
  clearTokens: tokenManager.clearTokens,

  instance: api
};

export default apiService;