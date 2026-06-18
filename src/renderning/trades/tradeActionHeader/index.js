'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './tradeActionHeader.module.scss';
import SearchIcon from '@/svg/searchIcon';
import FilterIcon from '@/svg/filterIcon';
import { motion, AnimatePresence } from 'framer-motion';
import ExportIcon from '@/svg/exportIcon';
import Button from '@/components/button';
import PlusIcon from '@/svg/plusIcon';
import { uploadTradesCsv } from '@/services/trades';
import toast from 'react-hot-toast';

export default function TradeActionHeader({ onExport, onUploadSuccess, onManualEntryClick, onApplyFilters }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    // Trade Filter states
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minProfit, setMinProfit] = useState('');
    const [maxProfit, setMaxProfit] = useState('');
    const [minCommission, setMinCommission] = useState('');
    const [maxCommission, setMaxCommission] = useState('');

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

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setMinProfit('');
        setMaxProfit('');
        setMinCommission('');
        setMaxCommission('');
        if (onApplyFilters) {
            onApplyFilters({});
        }
    };

    const handleApply = () => {
        const activeFilters = {};
        if (startDate) activeFilters.start_date = startDate;
        if (endDate) activeFilters.end_date = endDate;
        if (minProfit) activeFilters.min_profit = minProfit;
        if (maxProfit) activeFilters.max_profit = maxProfit;
        if (minCommission) activeFilters.min_commission = minCommission;
        if (maxCommission) activeFilters.max_commission = maxCommission;

        if (onApplyFilters) {
            onApplyFilters(activeFilters);
        }
        setIsOpen(false);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
        if (!isExcel) {
            toast.error("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await uploadTradesCsv(formData);
            if (res && res.status === 1) {
                toast.success(res.message || "Trades Excel file uploaded successfully!");
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
            } else {
                toast.error(res?.message || "Failed to upload trades Excel file");
            }
        } catch (err) {
            console.error("Excel upload failed:", err);
            toast.error(err?.message || "Something went wrong during file upload");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const activeCount = 
        (startDate ? 1 : 0) + 
        (endDate ? 1 : 0) + 
        (minProfit ? 1 : 0) + 
        (maxProfit ? 1 : 0) + 
        (minCommission ? 1 : 0) + 
        (maxCommission ? 1 : 0);
        
    const isFilterApplied = activeCount > 0;

    return (
        <div className={styles.tradeActionHeader}>
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
                                    {/* Date Range Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>Date Range</h4>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="date" 
                                                className={styles.filterInput}
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                            <input 
                                                type="date" 
                                                className={styles.filterInput}
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Profit Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>Profit Range</h4>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="number" 
                                                placeholder="Min" 
                                                className={styles.filterInput}
                                                value={minProfit}
                                                onChange={(e) => setMinProfit(e.target.value)}
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Max" 
                                                className={styles.filterInput}
                                                value={maxProfit}
                                                onChange={(e) => setMaxProfit(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Commission Section */}
                                    <div className={styles.filterSection}>
                                        <h4 className={styles.sectionTitle}>Commission Range</h4>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="number" 
                                                placeholder="Min" 
                                                className={styles.filterInput}
                                                value={minCommission}
                                                onChange={(e) => setMinCommission(e.target.value)}
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Max" 
                                                className={styles.filterInput}
                                                value={maxCommission}
                                                onChange={(e) => setMaxCommission(e.target.value)}
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
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <Button 
                    text={isUploading ? "Uploading..." : "Upload Excel"} 
                    icon={<PlusIcon />} 
                    onClick={handleUploadClick}
                    disabled={isUploading}
                />
                <Button 
                    text="Manual Entry" 
                    primaryOutline 
                    onClick={onManualEntryClick}
                />
            </div>
        </div>
    )
}
