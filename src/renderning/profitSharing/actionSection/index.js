'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './actionSection.module.scss';
import SearchIcon from '@/svg/searchIcon';
import FilterIcon from '@/svg/filterIcon';
import ExportIcon from '@/svg/exportIcon';

export default function ActionSection() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const dropdownVariants = {
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        },
        closed: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className={styles.actionSection}>
            <div className={styles.searchbar}>
                <input type='text' placeholder='Search' />
                <div className={styles.searchIcon}>
                    <SearchIcon />
                </div>
            </div>
            <div className={styles.rightAlignment}>
                <div className={styles.button}>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        Filters
                        <FilterIcon />
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                className={styles.filterDropdown}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={dropdownVariants}
                                style={{ transformOrigin: 'top right' }}
                            >
                                <div className={styles.filterItem}>
                                    <label>Status</label>
                                    <select>
                                        <option>All Statuses</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                <div className={styles.filterItem}>
                                    <label>Date Range</label>
                                    <select>
                                        <option>Last 30 Days</option>
                                        <option>Last 7 Days</option>
                                        <option>This Month</option>
                                    </select>
                                </div>
                                <div className={styles.filterActions}>
                                    <button className={styles.clearBtn} onClick={() => setIsFilterOpen(false)}>Clear</button>
                                    <button className={styles.applyBtn} onClick={() => setIsFilterOpen(false)}>Apply</button>
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
