import React from 'react';
import Card from '../../common/Card';

// Enhanced professional StatCard component for dashboard
const StatCard = ({ title, value, icon, onClick, trend }) => {
  // Define color themes for different card types
  const themes = {
    users: {
      iconColor: 'text-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      textAccent: 'text-blue-700'
    },
    cash: {
      iconColor: 'text-emerald-600',
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-100',
      textAccent: 'text-emerald-700'
    },
    chart: {
      iconColor: 'text-violet-600',
      bgGradient: 'bg-gradient-to-br from-violet-50 to-violet-100',
      iconBg: 'bg-violet-100',
      textAccent: 'text-violet-700'
    },
    default: {
      iconColor: 'text-gray-600',
      bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
      iconBg: 'bg-gray-100',
      textAccent: 'text-gray-700'
    }
  };

  const theme = themes[icon] || themes.default;

  const getIconComponent = () => {
    switch (icon) {
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'cash':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Optional trend indicator component
  const renderTrend = () => {
    if (!trend) return null;
    
    const isPositive = trend > 0;
    return (
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {Math.abs(trend)}%
      </div>
    );
  };

  return (
    <Card 
      className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${theme.bgGradient}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`${theme.iconBg} ${theme.iconColor} p-3 rounded-lg`}>
            {getIconComponent()}
          </div>
          {renderTrend()}
        </div>
        
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <p className={`text-3xl font-bold mt-1 ${theme.textAccent}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;