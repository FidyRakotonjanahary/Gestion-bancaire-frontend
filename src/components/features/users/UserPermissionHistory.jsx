// components/features/users/UserPermissionHistory.jsx
import React, { useState, useEffect } from 'react';
import { permissionService } from '../../../services/permissionService';
import PermissionHistoryTable from './PermissionHistoryTable';

const UserPermissionHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissionHistory = async () => {
      try {
        setLoading(true);
        const response = await permissionService.getPermissionHistory(userId);
        
        if (response.success) {
          setHistory(response.data);
        } else {
          setError('Erreur lors de la récupération de l\'historique');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPermissionHistory();
    }
  }, [userId]);

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 bg-red-50 text-red-500 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Historique des permissions</h2>
      <PermissionHistoryTable history={history} />
    </div>
  );
};

export default UserPermissionHistory;