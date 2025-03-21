// src/components/features/audit/AuditCounter.jsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../hooks/useSocket';

const AuditCounter = () => {
  const [stats, setStats] = useState({
    insertions: 0,
    modifications: 0,
    suppressions: 0
  });
  const socket = useSocket();

  useEffect(() => {
    // Charger les statistiques initiales
    const fetchInitialStats = async () => {
      try {
        const response = await fetch('/api/audit/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    fetchInitialStats();

    // Écouter les mises à jour en temps réel
    if (socket) {
      socket.on('audit:stats_update', (newStats) => {
        setStats(newStats);
      });
    }

    return () => {
      if (socket) {
        socket.off('audit:stats_update');
      }
    };
  }, [socket]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Compteurs d'opérations</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
          <span className="text-2xl font-bold text-green-600">{stats.insertions}</span>
          <span className="text-sm text-green-600">Insertions</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg">
          <span className="text-2xl font-bold text-amber-600">{stats.modifications}</span>
          <span className="text-sm text-amber-600">Modifications</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg">
          <span className="text-2xl font-bold text-red-600">{stats.suppressions}</span>
          <span className="text-sm text-red-600">Suppressions</span>
        </div>
      </div>
    </div>
  );
};

export default AuditCounter;