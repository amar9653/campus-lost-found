import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange = () => {},
  emptyMessage = 'No records found matching your filters'
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-muted">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>📂</span>
                    <span className="mt-2 fw-medium">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row[keyField] || rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="admin-pagination">
          <div>
            Showing <span className="fw-semibold text-dark">{startItem}</span> to{' '}
            <span className="fw-semibold text-dark">{endItem}</span> of{' '}
            <span className="fw-semibold text-dark">{totalItems}</span> entries
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              // Show bounded page buttons
              if (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    className={`page-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                );
              }
              if (p === currentPage - 2 || p === currentPage + 2) {
                return <span key={p} className="px-1 text-muted">...</span>;
              }
              return null;
            })}

            <button
              className="page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

