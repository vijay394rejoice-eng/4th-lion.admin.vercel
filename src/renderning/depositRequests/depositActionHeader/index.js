'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './depositActionHeader.module.scss';
import SearchIcon from '@/svg/searchIcon';
import FilterIcon from '@/svg/filterIcon';
import { motion, AnimatePresence } from 'framer-motion';
import ExportIcon from '@/svg/exportIcon';

export default function DepositActionHeader({
    onExport,
    search,
    onSearchChange,
    appliedFilters,
    onApplyFilters
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Local state for dropdown filters (committed on "Apply Filters")
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Local search state for immediate typing feedback
    const [localSearch, setLocalSearch] = useState(search);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync local search with parent search
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    // Debounce search input (500ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(localSearch);
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch, onSearchChange]);

    // Sync local dropdown state when opened
    useEffect(() => {
        if (isOpen) {
            setStatusFilter(appliedFilters?.status || '');
            setStartDate(appliedFilters?.startDate || '');
            setEndDate(appliedFilters?.endDate || '');
        }
    }, [isOpen, appliedFilters]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleStatusSelect = (status) => {
        // Toggle behavior: if already selected, clear it
        setStatusFilter(prev => prev === status ? '' : status);
    };

    const handleReset = () => {
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
    };

    const handleApply = () => {
        onApplyFilters({
            status: statusFilter,
            startDate,
            endDate
        });
        setIsOpen(false);
    };

    // Count how many filters are active in appliedFilters
    const activeCount = 
        (appliedFilters?.status ? 1 : 0) +
        (appliedFilters?.startDate ? 1 : 0) +
        (appliedFilters?.endDate ? 1 : 0);
        
    const isFilterApplied = activeCount > 0;

    return (
        <div className={styles.depositActionHeader}>
            <div className={styles.searchbar}>
                <input 
                    type='text' 
                    placeholder='Search by name, email, transaction or wallet ID' 
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                />
                <div className={styles.searchIcon}>
                    <SearchIcon />
                </div>
            </div>
            <div className={styles.rightContentAlignment}>
                <div className={styles.filterWrapper} ref={dropdownRef}>
                    <button
                        className={`${styles.filterBtn} ${isOpen ? styles.active : ''} ${isFilterApplied ? styles.hasFilters : ''}`}
                        onClick={toggleDropdown}
                    >
                        Filters
                        <div className={styles.iconBox}>
                            <FilterIcon />
                            <AnimatePresence>
                                {isFilterApplied && (
                                    <motion.span
                                        className={styles.filterBadge}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        {activeCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className={styles.dropdownMenu}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
                            >
                                <div className={styles.dropdownHeader}>
                                    <h3>Filters</h3>
                                    {isFilterApplied && (
                                        <button className={styles.resetBtn} onClick={handleReset}>
                                            Reset All
                                        </button>
                                    )}
                                </div>

                                <div className={styles.dropdownBody}>
                                    {/* Status Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>Status</h4>
                                        <div className={styles.statusGroup}>
                                            {['Pending', 'Success', 'Failed'].map((status) => {
                                                const value = status.toUpperCase();
                                                const lower = status.toLowerCase();
                                                const isActive = statusFilter === value;
                                                return (
                                                    <button
                                                        key={status}
                                                        className={`${styles.statusPill} ${styles[lower]} ${isActive ? styles.active : ''}`}
                                                        onClick={() => handleStatusSelect(value)}
                                                    >
                                                        {status}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Date Range Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>Date Range</h4>
                                        <div className={styles.inputRangeGroup}>
                                            <input 
                                                type="date" 
                                                value={startDate}
                                                max={endDate || undefined}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className={styles.filterInput}
                                            />
                                            <span className={styles.rangeDash}>-</span>
                                            <input 
                                                type="date" 
                                                value={endDate}
                                                min={startDate || undefined}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className={styles.filterInput}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.dropdownFooter}>
                                    <button className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </button>
                                    <button className={styles.applyBtn} onClick={handleApply}>
                                        Apply Filters
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className={styles.button}>
                    <button onClick={onExport}>
                        Export
                        <ExportIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}
