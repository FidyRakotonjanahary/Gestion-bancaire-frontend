import api from './api';

const versementService = {
  // Récupérer tous les versements
  getAllVersements: async () => {
    return await api.get('/versements');
  },

  // Récupérer un versement par son ID
  getVersementById: async (id) => {
    return await api.get(`/versements/${id}`);
  },

  // Créer un nouveau versement
  createVersement: async (versementData) => {
    return await api.post('/versements', versementData);
  },

  // Mettre à jour un versement
  updateVersement: async (id, versementData) => {
    return await api.put(`/versements/${id}`, versementData);
  },

  // Supprimer un versement
  deleteVersement: async (id) => {
    return await api.delete(`/versements/${id}`);
  },

  // Récupérer les versements par plage de dates
  getVersementsByDateRange: async (startDate, endDate) => {
    return await api.get(`/versements/date?start_date=${startDate}&end_date=${endDate}`);
  },

  // Récupérer le nombre total de versements
  getVersementCount: async () => {
    return await api.get('/versements/stats');
  },

  // Récupérer les versements d'un client spécifique
  getVersementsByClient: async (clientId) => {
    return await api.get(`/versements/client/${clientId}`);
  }
};

export default versementService;