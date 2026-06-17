'use client'
import React, { useState, useEffect } from 'react';
import styles from './pagination.module.scss';
import ChevronLeftIcon from '@/svg/chevronLeftIcon';
import ChevronRightIcon from '@/svg/chevronRightIcon';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const [gotoValue, setGotoValue] = useState(currentPage.toString());

  useEffect(() => {
    setGotoValue(currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleGotoSubmit = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(gotoValue, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        handlePageChange(page);
      } else {
        setGotoValue(currentPage.toString());
      }
    }
  };

  // Helper to calculate page numbers to show (with ellipsis)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // adjust visible page buttons
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, current, and neighbours
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);

      if (leftBound > 2) {
        pages.push('...');
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <div className={styles.leftSection}>
        <button 
          className={styles.arrowBtn} 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
        </button>
        {pages.map((page, index) => {
          if (page === '...') {
            return <span key={`dots-${index}`} className={styles.dots}>...</span>;
          }
          return (
            <button
              key={`page-${page}`}
              className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        })}
        <button 
          className={styles.arrowBtn} 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div className={styles.rightSection}>
        <span>Go To</span>
        <input 
          type="text" 
          className={styles.gotoInput} 
          value={gotoValue}
          onChange={(e) => setGotoValue(e.target.value)}
          onKeyDown={handleGotoSubmit}
          onBlur={() => setGotoValue(currentPage.toString())}
        />
      </div>
    </div>
  );
}
