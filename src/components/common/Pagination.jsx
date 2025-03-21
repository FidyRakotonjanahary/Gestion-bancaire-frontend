import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstButton = true,
  showLastButton = true,
  size = 'medium',
  className = ''
}) => {
  // Don't render if only 1 page
  if (totalPages <= 1) return null;

  // Calculate range of pages to show
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(
    Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
    totalPages
  );

  const siblingsStart = Math.max(
    Math.min(
      currentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(
      currentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  );

  // Create page items
  const itemList = [
    // First page
    ...(showFirstButton && currentPage > boundaryCount + siblingCount + 1
      ? [{ type: 'first', page: 1, label: '«' }]
      : []),
    
    // Previous page
    ...(currentPage > 1
      ? [{ type: 'prev', page: currentPage - 1, label: '‹' }]
      : []),
    
    // Start boundary pages
    ...startPages.map(page => ({ type: 'page', page, label: page })),
    
    // Start ellipsis
    ...(siblingsStart > boundaryCount + 2
      ? [{ type: 'ellipsis', page: -1, label: '...' }]
      : boundaryCount + 1 < siblingsStart
      ? [{ type: 'page', page: boundaryCount + 1, label: boundaryCount + 1 }]
      : []),
    
    // Sibling pages
    ...range(siblingsStart, siblingsEnd).map(page => ({
      type: 'page',
      page,
      label: page
    })),
    
    // End ellipsis
    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? [{ type: 'ellipsis', page: -1, label: '...' }]
      : siblingsEnd < totalPages - boundaryCount
      ? [{ type: 'page', page: totalPages - boundaryCount, label: totalPages - boundaryCount }]
      : []),
    
    // End boundary pages
    ...endPages.map(page => ({ type: 'page', page, label: page })),
    
    // Next page
    ...(currentPage < totalPages
      ? [{ type: 'next', page: currentPage + 1, label: '›' }]
      : []),
    
    // Last page
    ...(showLastButton && currentPage < totalPages - boundaryCount - siblingCount
      ? [{ type: 'last', page: totalPages, label: '»' }]
      : [])
  ];

  // Size classes
  const sizeClasses = {
    small: 'h-8 w-8 text-sm',
    medium: 'h-10 w-10',
    large: 'h-12 w-12 text-lg'
  };

  return (
    <nav className={`flex items-center justify-center ${className}`}>
      <ul className="flex items-center space-x-1">
        {itemList.map((item, index) => {
          const isActive = item.page === currentPage;
          const isDisabled = item.type === 'ellipsis';
          
          // Button classes
          const buttonBaseClasses = `flex items-center justify-center ${sizeClasses[size] || sizeClasses.medium} rounded-md focus:outline-none transition-colors duration-200`;
          const buttonActiveClasses = isActive
            ? 'bg-blue-600 text-white font-medium cursor-default'
            : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-300';
          const buttonDisabledClasses = isDisabled
            ? 'cursor-default text-gray-400'
            : 'cursor-pointer';
          
          return (
            <li key={index}>
              <button
                className={`${buttonBaseClasses} ${buttonActiveClasses} ${buttonDisabledClasses}`}
                onClick={() => !isDisabled && onPageChange(item.page)}
                disabled={isDisabled}
                aria-current={isActive ? 'page' : undefined}
                aria-label={
                  item.type === 'page'
                    ? `Page ${item.page}`
                    : item.type === 'first'
                    ? 'Première page'
                    : item.type === 'last'
                    ? 'Dernière page'
                    : item.type === 'prev'
                    ? 'Page précédente'
                    : item.type === 'next'
                    ? 'Page suivante'
                    : undefined
                }
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  boundaryCount: PropTypes.number,
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default Pagination;