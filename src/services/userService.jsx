import api from './api';

const userService = {
  // Récupérer tous les utilisateurs (admin)
  getAllUsers: async () => {
    return await api.get('/users');
  },

  // Récupérer un utilisateur par ID (admin)
  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  // Créer un nouvel utilisateur (admin)
  createUser: async (userData) => {
    return await api.post('/users', userData);
  },

  // Mettre à jour un utilisateur (admin)
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  // Supprimer un utilisateur (admin)
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  },

  // Modifier le statut d'un utilisateur (actif/inactif)
  updateUserStatus: async (id, isActive) => {
    return await api.patch(`/users/${id}/status`, { is_active: isActive });
  },

  // Récupérer les permissions d'un utilisateur
  getUserPermissions: async (id) => {
    return await api.get(`/users/${id}/permissions`);
  },

  // Mettre à jour les permissions d'un utilisateur
  updateUserPermissions: async (id, permissions) => {
    return await api.put(`/users/${id}/permissions`, { permissions });
  },

  // Récupérer l'historique des permissions
  getPermissionHistory: async (id) => {
    return await api.get(`/users/${id}/permission-history`);
  },

  // Récupérer l'historique des connexions
  getUserLoginHistory: async (id) => {
    return await api.get(`/users/${id}/login-history`);
  },

  // Récupérer le profil de l'utilisateur connecté
  getCurrentUserProfile: async () => {
    return await api.get('/users/profile/me');
  },

  // Mettre à jour le profil de l'utilisateur connecté
  updateCurrentUserProfile: async (profileData) => {
    return await api.put('/users/profile/me', profileData);
  },

  // Changer le mot de passe de l'utilisateur connecté
  changePassword: async (passwordData) => {
    return await api.put('/users/profile/me/password', passwordData);
  },

  // Récupérer l'historique des connexions de l'utilisateur connecté
  getCurrentUserLoginHistory: async () => {
    return await api.get('/users/profile/me/login-history');
  }
};

export default userService;