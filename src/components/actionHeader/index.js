'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './actionHeader.module.scss';
import SearchIcon from '@/svg/searchIcon';
import FilterIcon from '@/svg/filterIcon';
import { motion, AnimatePresence } from 'framer-motion';
import ExportIcon from '@/svg/exportIcon';

export default function ActionHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Filter states
    const [statusFilters, setStatusFilters] = useState([]); // ['active', 'inactive', 'pending']
    const [roleFilters, setRoleFilters] = useState([]);     // ['admin', 'editor', 'viewer', 'guest']
    const [lastActive, setLastActive] = useState('all');    // 'all', 'today', '7days', '30days'

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

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleStatusToggle = (status) => {
        setStatusFilters(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const handleRoleToggle = (role) => {
        setRoleFilters(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleReset = () => {
        setStatusFilters([]);
        setRoleFilters([]);
        setLastActive('all');
    };

    const handleApply = () => {
        console.log('Applied Filters:', {
            status: statusFilters,
            roles: roleFilters,
            lastActive
        });
        setIsOpen(false);
    };

    const activeCount = statusFilters.length + roleFilters.length + (lastActive !== 'all' ? 1 : 0);
    const isFilterApplied = activeCount > 0;

    return (
        <div className={styles.actionHeader}>
            <div className={styles.searchbar}>
                <input type='text' placeholder='Search' />
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
                                            {['Active', 'Inactive', 'Pending'].map((status) => {
                                                const lower = status.toLowerCase();
                                                const isActive = statusFilters.includes(lower);
                                                return (
                                                    <button
                                                        key={status}
                                                        className={`${styles.statusPill} ${styles[lower]} ${isActive ? styles.active : ''}`}
                                                        onClick={() => handleStatusToggle(lower)}
                                                    >
                                                        {status}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Role Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>User Role</h4>
                                        <div className={styles.checkboxGroup}>
                                            {['Admin', 'Editor', 'Viewer', 'Guest'].map((role) => {
                                                const lower = role.toLowerCase();
                                                const isActive = roleFilters.includes(lower);
                                                return (
                                                    <div
                                                        key={role}
                                                        className={`${styles.checkboxItem} ${isActive ? styles.active : ''}`}
                                                        onClick={() => handleRoleToggle(lower)}
                                                    >
                                                        <div className={styles.customCheck}>
                                                            {isActive && (
                                                                <motion.svg
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="3"
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </motion.svg>
                                                            )}
                                                        </div>
                                                        <span className={styles.checkboxLabel}>{role}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Last Active Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>Last Active</h4>
                                        <div className={styles.radioGroup}>
                                            {[
                                                { label: 'All Time', value: 'all' },
                                                { label: 'Today', value: 'today' },
                                                { label: 'Last 7 Days', value: '7days' },
                                                { label: 'Last 30 Days', value: '30days' }
                                            ].map((option) => {
                                                const isActive = lastActive === option.value;
                                                return (
                                                    <div
                                                        key={option.value}
                                                        className={`${styles.radioItem} ${isActive ? styles.active : ''}`}
                                                        onClick={() => setLastActive(option.value)}
                                                    >
                                                        <div className={styles.customRadio}>
                                                            {isActive && (
                                                                <motion.div
                                                                    className={styles.radioInner}
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                                />
                                                            )}
                                                        </div>
                                                        <span className={styles.radioLabel}>{option.label}</span>
                                                    </div>
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
                    <button>
                        Export
                        <ExportIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}
