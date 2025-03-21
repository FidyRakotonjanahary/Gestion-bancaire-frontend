import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  actions,
  variant = 'default',
  padding = 'default',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = "bg-white rounded-lg shadow";
  
  const variantClasses = {
    default: "border border-gray-200",
    primary: "border-l-4 border-blue-500",
    success: "border-l-4 border-green-500",
    warning: "border-l-4 border-yellow-500",
    danger: "border-l-4 border-red-500",
    info: "border-l-4 border-blue-400"
  };
  
  const paddingClasses = {
    none: "",
    small: "p-3",
    default: "p-5",
    large: "p-6"
  };
  
  const hoverClasses = hoverable ? "transition-all duration-200 hover:shadow-lg" : "";
  
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${paddingClasses[padding] || paddingClasses.default}
    ${hoverClasses}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className={`${padding === 'none' ? 'p-5' : ''} pb-3`}>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={`${(title || subtitle) && padding !== 'none' ? 'mt-2' : ''}`}>
        {children}
      </div>
      
      {(footer || actions) && (
        <div className={`${padding === 'none' ? 'p-5' : ''} mt-4 flex items-center justify-between`}>
          {footer && <div className="text-sm text-gray-500">{footer}</div>}
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  actions: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool
};

export default Card;