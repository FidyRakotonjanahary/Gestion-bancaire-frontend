// src/services/versementService.js
import api from './api';

/**
 * Récupère la liste des versements avec pagination
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @param {object} filters - Filtres optionnels (date, client, etc.)
 * @returns {Promise} - Promesse contenant les données des versements
 */
export const getVersements = (page = 1, limit = 10, filters = {}) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  });
  
  return api.get(`/versements?${queryParams.toString()}`);
};

/**
 * Récupère un versement par son ID
 * @param {string} id - ID du versement
 * @returns {Promise} - Promesse contenant les données du versement
 */
export const getVersementById = (id) => {
  return api.get(`/versements/${id}`);
};

/**
 * Crée un nouveau versement
 * @param {object} versementData - Données du versement à créer
 * @returns {Promise} - Promesse contenant les données du versement créé
 */
export const createVersement = (versementData) => {
  return api.post('/versements', versementData);
};

/**
 * Met à jour un versement existant
 * @param {string} id - ID du versement
 * @param {object} versementData - Nouvelles données du versement
 * @returns {Promise} - Promesse contenant les données du versement mis à jour
 */
export const updateVersement = (id, versementData) => {
  return api.put(`/versements/${id}`, versementData);
};

/**
 * Supprime un versement
 * @param {string} id - ID du versement à supprimer
 * @returns {Promise}
 */
export const deleteVersement = (id) => {
  return api.delete(`/versements/${id}`);
};

/**
 * Valide un versement (opération spécifique)
 * @param {string} id - ID du versement à valider
 * @returns {Promise}
 */
export const validateVersement = (id) => {
  return api.post(`/versements/${id}/validate`);
};

/**
 * Récupère les statistiques des versements
 * @param {object} params - Paramètres pour filtrer les statistiques
 * @returns {Promise} - Promesse contenant les statistiques
 */
export const getVersementStats = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return api.get(`/versements/stats?${queryParams.toString()}`);
};

/**
 * Exporte les versements au format CSV
 * @param {object} filters - Filtres pour l'exportation
 * @returns {Promise} - Promesse contenant le lien de téléchargement
 */
export const exportVersements = (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return api.get(`/versements/export?${queryParams.toString()}`, {
    responseType: 'blob'
  });
};