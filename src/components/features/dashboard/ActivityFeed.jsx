// src/components/features/dashboard/ActivityFeed.jsx
import React from 'react';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start border-b pb-3 last:border-0">
              <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                activity.type === 'insertion' ? 'bg-green-500' :
                activity.type === 'modification' ? 'bg-amber-500' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.date} • {activity.user}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucune activité récente</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

