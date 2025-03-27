import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  data = [],
  isLoading = false,
  noDataMessage = "Aucune donnée disponible",
  sorting = null,
  onSort,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  hoverable = true,
  dense = false,
  className = ''
}) => {
  // S'assurer que data est toujours un tableau et qu'il contient des éléments valides
  const safeData = Array.isArray(data) ? data : [];
  
  // Handle sorting
  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;
    
    const direction = 
      sorting && sorting.column === column.accessor && sorting.direction === 'asc'
        ? 'desc'
        : 'asc';
    
    onSort({ column: column.accessor, direction });
  };
  
  // Get sort icon
  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    
    if (sorting && sorting.column === column.accessor) {
      return sorting.direction === 'asc' 
        ? <span>▲</span> 
        : <span>▼</span>;
    }
    
    return <span className="text-gray-400">▲▼</span>;
  };
  
  // Handle row selection
  const isSelected = (row) => {
    return selectedRows.some(selectedRow => selectedRow.id === row.id);
  };
  
  const handleSelectAll = () => {
    if (onSelectAll) {
      const allSelected = safeData.length > 0 && selectedRows.length === safeData.length;
      onSelectAll(!allSelected);
    }
  };
  
  const allSelected = safeData.length > 0 && selectedRows.length === safeData.length;
  
  // Styles
  const tableClasses = `min-w-full divide-y divide-gray-200 ${className}`;
  const headerCellClasses = `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`;
  const bodyCellClasses = `px-6 ${dense ? 'py-2' : 'py-4'} whitespace-nowrap text-sm text-gray-900`;
  const rowClasses = `
    border-b border-gray-200 
    ${hoverable ? 'hover:bg-gray-50' : ''} 
    ${onRowClick ? 'cursor-pointer' : ''}
  `;

  return (
    <div className="overflow-x-auto shadow border-b border-gray-200 rounded-lg">
      <table className={tableClasses}>
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className={headerCellClasses} style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={headerCellClasses}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Chargement...
              </td>
            </tr>
          ) : safeData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {noDataMessage}
              </td>
            </tr>
          ) : (
            // Utiliser une vérification supplémentaire pour s'assurer que safeData est valide
            Array.isArray(safeData) && safeData.map((row, rowIndex) => (
              <tr
                key={row?.id || rowIndex}
                className={rowClasses}
                onClick={() => onRowClick && row && onRowClick(row)}
              >
                {selectable && (
                  <td className={bodyCellClasses}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={row && isSelected(row)}
                      onChange={() => onSelectRow && row && onSelectRow(row)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.accessor} className={bodyCellClasses}>
                    {row && column.cell ? column.cell(row) : row?.[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      cell: PropTypes.func,
      sortable: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  noDataMessage: PropTypes.string,
  sorting: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc'])
  }),
  onSort: PropTypes.func,
  onRowClick: PropTypes.func,
  selectable: PropTypes.bool,
  selectedRows: PropTypes.array,
  onSelectRow: PropTypes.func,
  onSelectAll: PropTypes.func,
  hoverable: PropTypes.bool,
  dense: PropTypes.bool,
  className: PropTypes.string
};

export default Table;