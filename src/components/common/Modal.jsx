import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  preventScroll = true,
}) => {
  const modalRef = useRef(null);
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && closeOnEsc) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle body scroll
  useEffect(() => {
    if (isOpen && preventScroll) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, preventScroll]);
  
  // Handle click outside
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOverlayClick) {
      onClose();
    }
  };
  
  // Set size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  // Don't render if modal is not open
  if (!isOpen) return null;
  
  // Render modal using createPortal
  return createPortal(
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title ? 'modal-title' : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      ></div>
      
      {/* Modal content centering container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Modal panel */}
        <div 
          ref={modalRef}
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} relative transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
            aria-label="Fermer"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Header */}
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            </div>
          )}
          
          {/* Body */}
          <div className={`px-6 py-4 ${!title ? 'pt-8' : ''} ${!footer ? 'pb-6' : ''}`}>
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full']),
  closeOnOverlayClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  preventScroll: PropTypes.bool
};

export default Modal;