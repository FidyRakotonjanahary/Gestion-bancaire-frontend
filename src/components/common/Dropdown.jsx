import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  trigger,
  items,
  placement = 'bottom-left',
  width = 'auto',
  className = '',
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle placement
  const getPlacementClasses = () => {
    switch (placement) {
      case 'bottom-left':
        return 'origin-top-left left-0 top-full mt-1';
      case 'bottom-right':
        return 'origin-top-right right-0 top-full mt-1';
      case 'top-left':
        return 'origin-bottom-left left-0 bottom-full mb-1';
      case 'top-right':
        return 'origin-bottom-right right-0 bottom-full mb-1';
      default:
        return 'origin-top-left left-0 top-full mt-1';
    }
  };

  // Handle item click
  const handleItemClick = (item) => {
    setIsOpen(false);
    if (onSelect) onSelect(item);
    if (item.onClick) item.onClick();
  };

  // Handle toggle
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Get width classes
  const widthClasses = {
    auto: 'min-w-max',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-72',
    full: 'w-full'
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div 
        onClick={toggleDropdown} 
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`
            absolute z-10 mt-1 ${getPlacementClasses()} ${widthClasses[width] || widthClasses.auto}
            bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1
          `}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <div className="h-px bg-gray-200 my-1"></div>
              ) : (
                <div
                  className={`
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                    ${item.danger ? 'text-red-600' : ''} 
                    text-gray-700 block px-4 py-2 text-sm
                  `}
                  onClick={() => !item.disabled && handleItemClick(item)}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.node.isRequired,
        icon: PropTypes.node,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        danger: PropTypes.bool
      }),
      PropTypes.shape({
        divider: PropTypes.bool.isRequired
      })
    ])
  ).isRequired,
  placement: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
  width: PropTypes.oneOf(['auto', 'sm', 'md', 'lg', 'full']),
  className: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool
};

export default Dropdown;