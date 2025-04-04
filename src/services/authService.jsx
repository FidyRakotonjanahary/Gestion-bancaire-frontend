import apiService from './api';
import * as jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const authService = {
  login: async (credentials) => {
    try {
      console.log('Tentative de connexion avec :', credentials);
      const response = await apiService.post('/auth/login', credentials);
      console.log('Réponse du serveur :', response);

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Stockage du token et infos utilisateur
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        // Configuration du header d'authentification
        apiService.setAuthHeader(token);

        // Notification de succès
        toast.success('Connexion réussie', {
          icon: <FaCheckCircle className="text-green-500" />,
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        return { success: true, user };
      }

      // Cas où le serveur retourne success: false
      return {
        success: false,
        message: response.data.message,
        shouldShowToast: true
      };

    } catch (error) {
      console.error('Détails complets de l\'erreur :', error);
      let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      let shouldShowToast = true;

      if (error.response) {
        if (error.response.data.status === 'inactive') {
          errorMessage = 'Votre compte est désactivé. Veuillez contacter l\'administrateur.';
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Pas de réponse du serveur. Vérifiez votre connexion internet.';
      }

      return {
        success: false,
        message: errorMessage,
        shouldShowToast
      };
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!token) {
      return null; // Simple retour null si pas de token
    }
  
    if (!authService.isTokenValid()) {
      // Déconnexion sans redirection immédiate
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  
    try {
      const response = await apiService.get('/auth/me');
      return response.data.success ? response.data.data.user : null;
    } catch (error) {
      console.error('Erreur de récupération de l\'utilisateur :', error);
      
      if (error.response?.status === 401) {
        toast.error('Votre session a expiré');
      }
      
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Tenter de se déconnecter côté serveur
      await apiService.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.warn('Erreur de déconnexion côté serveur:', error);
    } finally {
      // Toujours effacer le stockage local et rediriger
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
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
      
      // Check expiration with 30-second margin
      return decoded.exp > (currentTime + 30);
    } catch (error) {
      console.error('Token invalide :', error);
      return false;
    }
  },
};

export default authService;