import apiService from './api';

/**
 * Service pour gérer les appels API liés à l'audit
 */
class AuditService {
  /**
   * Récupère toutes les entrées d'audit
   * @param {Object} params - Paramètres de pagination et filtrage
   * @returns {Promise} Promesse contenant les données d'audit
   */
  getAllAudits(params = {}) {
    return apiService.get('/audit', { params });
  }

  /**
   * Récupère une entrée d'audit par son ID
   * @param {string} id - ID de l'entrée d'audit
   * @returns {Promise} Promesse contenant les détails de l'entrée d'audit
   */
  getAuditById(id) {
    return apiService.get(`/audit/${id}`);
  }

  /**
   * Récupère les compteurs d'audit
   * @returns {Promise} Promesse contenant les compteurs d'audit
   */
  getAuditCounters() {
    return apiService.get('/audit/counters');
  }

  /**
   * Récupère les statistiques détaillées d'audit
   * @param {Object} params - Paramètres de filtrage pour les statistiques
   * @returns {Promise} Promesse contenant les statistiques d'audit
   */
  getAuditStats(params = {}) {
    return apiService.get('/audit/stats', { params });
  }

  /**
   * Récupère les entrées d'audit pour un utilisateur spécifique
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} params - Paramètres de pagination et filtrage
   * @returns {Promise} Promesse contenant les audits de l'utilisateur
   */
  getAuditsByUser(userId, params = {}) {
    return apiService.get(`/audit/user/${userId}`, { params });
  }

  /**
   * Récupère les entrées d'audit pour un client spécifique
   * @param {string} clientId - ID du client
   * @param {Object} params - Paramètres de pagination et filtrage
   * @returns {Promise} Promesse contenant les audits du client
   */
  getAuditEntriesByClient(clientId, params = {}) {
    return apiService.get(`/audit/client/${clientId}`, { params });
  }

  /**
   * Récupère l'historique des changements de solde d'un client
   * @param {string} clientId - ID du client
   * @param {Object} params - Paramètres de pagination et filtrage
   * @returns {Promise} Promesse contenant l'historique des soldes
   */
  getClientBalanceHistory(clientId, params = {}) {
    return apiService.get(`/audit/client/${clientId}/balance-history`, { params });
  }

  /**
   * Récupère les entrées d'audit pour un versement spécifique
   * @param {string} versementId - ID du versement
   * @param {Object} params - Paramètres de pagination et filtrage
   * @returns {Promise} Promesse contenant les audits du versement
   */
  getAuditEntriesByVersement(versementId, params = {}) {
    return apiService.get(`/audit/versement/${versementId}`, { params });
  }

  /**
   * Récupère les entrées d'audit par type d'action
   * @param {string} actionType - Type d'action à filtrer
   * @param {Object} params - Paramètres de pagination et filtrage
   * @returns {Promise} Promesse contenant les audits filtrés par type d'action
   */
  getAuditsByActionType(actionType, params = {}) {
    return apiService.get(`/audit/type/${actionType}`, { params });
  }

  /**
   * Récupère les audits récents
   * @param {Object} params - Paramètres de pagination et limite
   * @returns {Promise} Promesse contenant les audits récents
   */
  getRecentAudits(params = {}) {
    return apiService.get('/audit/recent', { params });
  }

 /**
 * Récupère les audits par plage de dates
 * @param {Object} params - Paramètres incluant startDate, endDate et filtres supplémentaires
 * @returns {Promise} Promesse contenant les audits dans la plage de dates
 */
getAuditsByDateRange(params = {}) {
    return apiService.get('/audit/date-range', { params });
  }
}

// Export d'une instance unique du service
export default new AuditService();