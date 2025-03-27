// components/features/users/LoginHistoryTable.jsx
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const LoginHistoryTable = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-md">
        Aucun historique de connexion disponible
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
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresse IP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Navigateur
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((entry) => (
            <tr key={entry.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(entry.timestamp), 'dd MMM yyyy HH:mm:ss', { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    entry.action_type === 'login'
                      ? 'bg-green-100 text-green-800'
                      : entry.action_type === 'logout'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {entry.action_type === 'login'
                    ? 'Connexion'
                    : entry.action_type === 'logout'
                    ? 'Déconnexion'
                    : entry.action_type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.ip_address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.user_agent ? (
                  <span className="truncate max-w-xs block">{entry.user_agent}</span>
                ) : (
                  <span className="text-gray-400">Non disponible</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistoryTable;
