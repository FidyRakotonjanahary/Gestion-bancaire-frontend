// src/components/features/audit/RealTimeAudit.jsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../hooks/useSocket';

const RealTimeAudit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    // Charger les derniers journaux d'audit
    const fetchRecentAudits = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/audit/recent');
        const data = await response.json();
        if (data.success) {
          setAuditLogs(data.audits);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des audits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentAudits();

    // Écouter les nouveaux événements d'audit
    if (socket) {
      socket.on('audit:new_record', (newAudit) => {
        setAuditLogs((prevLogs) => [newAudit, ...prevLogs].slice(0, 20));
      });
    }

    return () => {
      if (socket) {
        socket.off('audit:new_record');
      }
    };
  }, [socket]);

  const getActionColor = (action) => {
    switch (action) {
      case 'INSERT':
        return 'text-green-600 bg-green-50';
      case 'UPDATE':
        return 'text-amber-600 bg-amber-50';
      case 'DELETE':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Activités en temps réel</h2>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {auditLogs.length > 0 ? (
          auditLogs.map((log, index) => (
            <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${getActionColor(log.action_type)}`}>
                    {log.action_type}
                  </span>
                  <span className="ml-2 text-sm font-medium">{log.details}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                <span>Par: {log.user_name}</span>
                {log.amount_difference && (
                  <span className="ml-2">
                    Différence: {log.amount_difference > 0 ? '+' : ''}{log.amount_difference.toFixed(2)} €
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">Aucune activité récente</div>
        )}
      </div>
    </div>
  );
};

export default RealTimeAudit;