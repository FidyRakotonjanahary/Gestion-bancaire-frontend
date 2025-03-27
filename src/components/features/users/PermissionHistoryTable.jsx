// components/features/users/PermissionHistoryTable.jsx
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PermissionHistoryTable = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-md">
        Aucun historique de permissions disponible
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modifié par
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((entry) => (
            <tr key={entry.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(entry.changed_at), 'dd MMM yyyy HH:mm:ss', { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {entry.permission_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    entry.is_granted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {entry.is_granted ? 'Accordée' : 'Révoquée'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.changed_by_username || 'Système'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionHistoryTable;