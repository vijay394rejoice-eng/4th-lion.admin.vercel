"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./dpRequestsActionHeader.module.scss";
import SearchIcon from "@/svg/searchIcon";
import FilterIcon from "@/svg/filterIcon";
import { motion, AnimatePresence } from "framer-motion";
import ExportIcon from "@/svg/exportIcon";

export default function DPRequestsActionHeader({
  onExport,
  onApplyFilters,
  search = "",
  onSearchChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState(""); // "" (All), "PENDING", "APPROVED"

  // Local search state for immediate typing feedback
  const [localSearch, setLocalSearch] = useState(search);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync local search with parent search (e.g. if cleared externally)
  useEffect(() => {
    setLocalSearch(search?.trim() || "");
  }, [search]);

  // Debounce effect for search input (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearch?.trim());
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleReset = () => {
    setStatusFilter("");
    if (onApplyFilters) {
      onApplyFilters({ status: undefined });
    }
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({ status: statusFilter || undefined });
    }
    setIsOpen(false);
  };

  const activeCount = statusFilter ? 1 : 0;
  const isFilterApplied = activeCount > 0;

  return (
    <div className={styles.dpRequestsActionHeader}>
      <div className={styles.searchbar}>
        <input
          type="text"
          placeholder="Search"
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
            className={`${styles.filterBtn} ${isOpen ? styles.active : ""} ${isFilterApplied ? styles.hasFilters : ""}`}
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
                    <select
                      className={styles.statusSelect}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className={styles.dropdownFooter}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setIsOpen(false)}
                  >
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
  );
}

