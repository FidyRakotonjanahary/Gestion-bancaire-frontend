// src/components/features/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorClasses[color] || 'bg-blue-500'} text-white`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;

