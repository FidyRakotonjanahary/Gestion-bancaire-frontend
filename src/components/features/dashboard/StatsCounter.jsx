// src/components/features/dashboard/StatsCounter.jsx
import React from 'react';

const StatsCounter = ({ insertions, modifications, suppressions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Statistiques des opérations</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{insertions}</div>
          <div className="text-sm text-gray-500">Insertions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">{modifications}</div>
          <div className="text-sm text-gray-500">Modifications</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{suppressions}</div>
          <div className="text-sm text-gray-500">Suppressions</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;