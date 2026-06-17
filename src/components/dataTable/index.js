'use client'
import React, { useState } from 'react';
import styles from './dataTable.module.scss';
import Pagination from '@/components/pagination';

export default function DataTable({
  columns = [],
  data = [],
  // Controlled pagination props
  currentPage,
  pageSize = 10,
  totalItems,
  onPageChange,
  // Customization
  emptyMessage = 'No records found',
  minWidth = '900px',
}) {
  // If controlled pagination is not provided, manage page state internally
  const isControlled = currentPage !== undefined && onPageChange !== undefined;
  
  const [internalPage, setInternalPage] = useState(1);
  const activePage = isControlled ? currentPage : internalPage;
  
  const handlePageChange = (page) => {
    if (isControlled) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const totalRecords = isControlled ? totalItems : data.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  
  // Slice data locally if not controlled
  const paginatedData = isControlled 
    ? data 
    : data.slice((activePage - 1) * pageSize, activePage * pageSize);

  return (
    <div className={styles.dataTableContainer}>
      <div className={styles.tableWrapper}>
        {/* Floating Header Card */}
        <div className={styles.headerCard} style={{ minWidth }}>
          <table className={styles.table}>
            <colgroup>
              {columns.map((col, idx) => (
                <col key={idx} style={{ width: col.width || 'auto' }} />
              ))}
            </colgroup>
            <thead className={styles.thead}>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={col.headerClassName || ''}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Floating Body Card containing stacked rows */}
        <div className={styles.bodyCard} style={{ minWidth }}>
          <table className={styles.table}>
            <colgroup>
              {columns.map((col, idx) => (
                <col key={idx} style={{ width: col.width || 'auto' }} />
              ))}
            </colgroup>
            <tbody className={styles.tbody}>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr key={row.id !== undefined ? row.id : rowIdx}>
                    {columns.map((col, colIdx) => {
                      const value = col.accessor ? row[col.accessor] : undefined;
                      const cellClass = col.className || '';
                      
                      return (
                        <td key={colIdx} className={cellClass}>
                          {col.cell ? col.cell(row, rowIdx) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.emptyCell}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {totalRecords > 0 && (
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
