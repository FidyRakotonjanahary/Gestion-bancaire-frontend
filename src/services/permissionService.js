// services/permissionService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration des headers avec le token JWT
const authHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("Aucun token d'authentification trouvé");
    // Vous pourriez rediriger ici si nécessaire
    // window.location.href = '/login';
    return null; // Retourner null pour indiquer qu'il n'y a pas de token
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Services pour la gestion des permissions
export const permissionService = {
  // Récupérer toutes les permissions
  getAllPermissions: async () => {
    console.log("Tentative de récupération des permissions...");
    
    const token = localStorage.getItem('token');
    console.log("Token présent:", !!token);
    
    try {
      const headers = authHeader();
      console.log("Headers d'authentification:", headers);
      
      if (!headers) {
        console.error("Impossible de récupérer les permissions - non authentifié");
        return { success: false, data: [] };
      }
      
      console.log("Envoi de la requête à:", `${API_URL}/permissions`);
      const response = await axios.get(`${API_URL}/permissions`, headers);
      console.log("Réponse reçue:", response.status);
      return response.data;
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.status, error.response?.data);
      return { success: false, data: [] };
    }
  },

  // Récupérer les permissions d'un utilisateur
  getUserPermissions: async (userId) => {
    try {
      const headers = authHeader();
      if (!headers) return { success: false, data: [] };
      
      const response = await axios.get(
        `${API_URL}/permissions/user/${userId}`,
        headers
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des permissions de l'utilisateur ${userId}:`, error);
      return { success: false, data: [] };
    }
  },

  // Mettre à jour les permissions d'un utilisateur
  updateUserPermissions: async (userId, permissions) => {
    try {
      const response = await axios.put(
        `${API_URL}/permissions/user/${userId}`,
        { permissions },
        authHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Réinitialiser les permissions d'un utilisateur
  resetUserPermissions: async (userId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/permissions/user/${userId}`,
        authHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer l'historique des permissions d'un utilisateur
  getPermissionHistory: async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/permissions/user/${userId}/history`,
        authHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};