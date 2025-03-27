import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaExclamationCircle } from 'react-icons/fa';

const Dropdown = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = 'Sélectionner une option',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            block w-full px-3 py-2 border 
            ${error 
              ? 'border-red-400 text-red-900 focus:ring-red-500 focus:border-red-500' 
              : 'border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-600'
            }
            rounded-lg shadow-sm 
            ${disabled 
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
              : 'bg-white hover:border-slate-400'
            }
            appearance-none
            pr-10
            text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
          {...props}
        >
          <option value="" disabled={required} className="text-slate-500">
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="text-slate-900"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <FaChevronDown 
            className={`h-4 w-4 ${disabled ? 'text-slate-400' : 'text-slate-600'}`} 
            aria-hidden="true" 
          />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600 space-x-1">
          <FaExclamationCircle className="h-4 w-4 inline-block mr-1 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string, 
        PropTypes.number
      ]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default Dropdown;