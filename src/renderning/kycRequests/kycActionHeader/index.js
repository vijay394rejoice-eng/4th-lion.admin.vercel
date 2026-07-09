'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './kycActionHeader.module.scss';
import SearchIcon from '@/svg/searchIcon';
import FilterIcon from '@/svg/filterIcon';
import { motion, AnimatePresence } from 'framer-motion';
import ExportIcon from '@/svg/exportIcon';
import classNames from 'classnames';

export default function KycActionHeader({
    onExport,
    search = "",
    onSearchChange,
    status = "",
    onStatusChange,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Local filter state inside the dropdown (committed on "Apply")
    const [localStatus, setLocalStatus] = useState("all");

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

    // Sync local search with parent search (e.g. if cleared externally)
    useEffect(() => {
        setLocalSearch(search?.trim() || "");
    }, [search]);

    // Debounce effect for search input (500ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(localSearch?.trim());
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch, onSearchChange]);

    // Sync dropdown filter with applied filters when the dropdown opens
    useEffect(() => {
        if (isOpen) {
            setLocalStatus(status || "all");
        }
    }, [isOpen, status]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleReset = () => {
        setLocalStatus("all");
    };

    const handleApply = () => {
        onStatusChange(localStatus === "all" ? "" : localStatus);
        setIsOpen(false);
    };

    const isAppliedFilterPresent = status && status !== "all";
    const appliedCount = isAppliedFilterPresent ? 1 : 0;
    const isLocalFilterApplied = localStatus !== "all";

    return (
        <div className={styles.kycActionHeader}>
            <div className={styles.searchbar}>
                <input
                    type='text'
                    placeholder='Search'
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
                        className={`${styles.filterBtn} ${isOpen ? styles.active : ''} ${isAppliedFilterPresent ? styles.hasFilters : ''}`}
                        onClick={toggleDropdown}
                    >
                        Filters
                        <div className={styles.iconBox}>
                            <FilterIcon />
                            <AnimatePresence>
                                {isAppliedFilterPresent && (
                                    <motion.span
                                        className={styles.filterBadge}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        {appliedCount}
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
                                    {isLocalFilterApplied && (
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
                                            {['all', 'PENDING', 'APPROVED', 'REJECTED'].map((statusOption) => {
                                                const isActive = localStatus === statusOption;
                                                const isPending = statusOption === 'PENDING';
                                                const isApproved = statusOption === 'APPROVED';
                                                const isRejected = statusOption === 'REJECTED';
                                                const isAll = statusOption === 'all';
                                                
                                                return (
                                                    <button
                                                        key={statusOption}
                                                        className={classNames(styles.statusPill, {
                                                            [styles.active]: isActive,
                                                            [styles.pending]: isPending && isActive,
                                                            [styles.inactive]: isRejected && isActive,
                                                            [styles.all]: isAll && isActive,
                                                        })}
                                                        onClick={() => setLocalStatus(statusOption)}
                                                    >
                                                        {statusOption === 'all' ? 'All' : statusOption.charAt(0) + statusOption.slice(1).toLowerCase()}
                                                    </button>
                                                );
                                            })}
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
