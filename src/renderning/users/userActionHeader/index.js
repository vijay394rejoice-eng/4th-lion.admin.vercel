"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./userActionHeader.module.scss";
import SearchIcon from "@/svg/searchIcon";
import FilterIcon from "@/svg/filterIcon";
import { motion, AnimatePresence } from "framer-motion";
import ExportIcon from "@/svg/exportIcon";
import classNames from "classnames";

export default function UserActionHeader({
  onExport,
  search,
  onSearchChange,
  appliedFilters,
  onApplyFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Local filter states inside the dropdown (committed on "Apply")
  const [statusFilters, setStatusFilters] = useState([]);
  const [roleFilters, setRoleFilters] = useState([]);

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
    setLocalSearch(search);
  }, [search]);

  // Debounce effect for search input (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  // Sync dropdown filters with applied filters when the dropdown opens
  useEffect(() => {
    if (isOpen) {
      setStatusFilters(
        appliedFilters?.statuses?.length > 0
          ? appliedFilters.statuses
          : ["all"],
      );
      setRoleFilters(appliedFilters?.roles || []);
    }
  }, [isOpen, appliedFilters]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleStatusSelect = (status) => {
    setStatusFilters([status]);
  };

  const handleRoleToggle = (role) => {
    setRoleFilters((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleReset = () => {
    setStatusFilters(["all"]);
    setRoleFilters([]);
  };

  const handleApply = () => {
    onApplyFilters({
      roles: roleFilters,
      statuses: statusFilters,
    });
    setIsOpen(false);
  };

  const activeStatusCount =
    appliedFilters?.statuses?.filter((s) => s !== "all").length || 0;
  const appliedCount = activeStatusCount + (appliedFilters?.roles?.length || 0);
  const isAppliedFilterPresent = appliedCount > 0;

  const isLocalFilterApplied =
    (statusFilters.length > 0 && !statusFilters.includes("all")) ||
    roleFilters.length > 0;

  return (
    <div className={styles.userActionHeader}>
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
            className={`${styles.filterBtn} ${isOpen ? styles.active : ""} ${isAppliedFilterPresent ? styles.hasFilters : ""}`}
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
                      {["All", "Active", "Inactive"].map((status) => {
                        const lower = status.toLowerCase();
                        const isActive = statusFilters.includes(lower);
                        return (
                          <button
                            key={status}
                            className={classNames(styles.statusPill, {
                              [styles.active]: isActive,
                              [styles.inactive]:
                                lower === "inactive" && isActive,
                              [styles.all]: lower === "all" && isActive,
                            })}
                            onClick={() => handleStatusSelect(lower)}
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
                      {["User", "Partner"].map((role) => {
                        const value = role.toUpperCase(); // "USER", "PARTNER"
                        const isActive = roleFilters.includes(value);
                        return (
                          <div
                            key={role}
                            className={`${styles.checkboxItem} ${isActive ? styles.active : ""}`}
                            onClick={() => handleRoleToggle(value)}
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
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </motion.svg>
                              )}
                            </div>
                            <span className={styles.checkboxLabel}>{role}</span>
                          </div>
                        );
                      })}
                    </div>
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
