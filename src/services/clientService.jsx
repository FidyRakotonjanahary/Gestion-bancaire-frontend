import api from './api';

const clientService = {
  // Récupérer tous les clients
  getAllClients: async () => {
    return await api.get('/clients');
  },

  // Récupérer un client par son ID
  getClientById: async (id) => {
    return await api.get(`/clients/${id}`);
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    return await api.post('/clients', clientData);
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    return await api.put(`/clients/${id}`, clientData);
  },

  // Supprimer un client
  deleteClient: async (id) => {
    return await api.delete(`/clients/${id}`);
  },

  // Récupérer le solde d'un client
  getClientBalance: async (id) => {
    return await api.get(`/clients/${id}/balance`);
  },

  // Récupérer le compte client par numéro de compte
  getClientByAccountNumber: async (accountNumber) => {
    return await api.get(`/clients/account/${accountNumber}`);
  },

  // Récupérer les versements d'un client
  getClientVersements: async (id) => {
    return await api.get(`/clients/${id}/versements`);
  },

  // Rechercher des clients
  searchClients: async (term) => {
    return await api.get(`/clients/search?term=${term}`);
  },

  // Obtenir le nombre total de clients
  getClientCount: async () => {
    return await api.get('/clients/count');
  },

  // Récupérer les clients avec un solde positif
  getClientsWithBalance: async () => {
    return await api.get('/clients/with-balance');
  },

  // Récupérer l'historique du solde d'un client
  getClientBalanceHistory: async (id) => {
    return await api.get(`/clients/${id}/history`);
  }
};

export default clientService;