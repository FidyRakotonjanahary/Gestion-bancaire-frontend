// src/components/features/audit/AuditList.jsx
import React, { useState, useEffect } from 'react';
import { auditService } from '../../../services/auditService';

const AuditList = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    actionType: '',
    userId: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchAudits();
  }, [pagination.page, filters]);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const response = await auditService.getAudits(page, limit, filters);
      
      setAudits(response.data.audits);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getActionBadge = (action) => {
    switch(action) {
      case 'INSERT':
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Insertion</span>;
      case 'UPDATE':
        return <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800">Modification</span>;
      case 'DELETE':
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Suppression</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{action}</span>;
    }
  };

  if (loading && audits.length === 0) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Historique d'audit</h2>
        
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'action</label>
            <select
              name="actionType"
              value={filters.actionType}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            >
              <option value="">Tous</option>
              <option value="INSERT">Insertion</option>
              <option value="UPDATE">Modification</option>
              <option value="DELETE">Suppression</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              placeholder="ID ou nom d'utilisateur"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tableau des audits */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montants</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {audits.length > 0 ? (
              audits.map((audit, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActionBadge(audit.action_type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{audit.details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{audit.user_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(audit.created_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {audit.old_amount !== null && audit.new_amount !== null && (
                      <div className="text-sm">
                        <span className="text-gray-500">{audit.old_amount.toFixed(2)} € → </span>
                        <span className="font-medium">{audit.new_amount.toFixed(2)} €</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun enregistrement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {((pagination.page - 1) * pagination.limit) + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} enregistrements
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page * pagination.limit >= pagination.total}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditList;