import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({
  size = 'medium',
  color = 'primary',
  label = 'Chargement...',
  showLabel = false,
  fullScreen = false,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Color classes
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600'
  };

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-lg">
          <svg 
            className={`animate-spin ${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.primary}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {showLabel && <span className="text-gray-700">{label}</span>}
        </div>
      </div>
    );
  }

  // Regular spinner
  return (
    <div className={`inline-flex items-center ${showLabel ? 'space-x-2' : ''} ${className}`}>
      <svg 
        className={`animate-spin ${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.primary}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {showLabel && <span>{label}</span>}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'success', 'danger', 'warning']),
  label: PropTypes.string,
  showLabel: PropTypes.bool,
  fullScreen: PropTypes.bool,
  className: PropTypes.string
};

export default Spinner;