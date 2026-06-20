"use client";
import React, { useState, useEffect } from "react";
import styles from "./subAdminHeader.module.scss";
import SearchIcon from "@/svg/searchIcon";
import ExportIcon from "@/svg/exportIcon";
import Button from "@/components/button";
import PlusIcon from "@/svg/plusIcon";

export default function SubAdminHeader({ email, onEmailChange, onExport, onAddClick }) {
  const [localEmail, setLocalEmail] = useState(email);

  // Sync localEmail with parent state (if reset externally)
  useEffect(() => {
    setLocalEmail(email);
  }, [email]);

  // Debounce email change (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      onEmailChange(localEmail);
    }, 500);
    return () => clearTimeout(handler);
  }, [localEmail, onEmailChange]);

  return (
    <div className={styles.subAdminHeader}>
      <div className={styles.searchbar}>
        <input 
          type="text" 
          placeholder="Search by email" 
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
        />
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
      </div>
      <div className={styles.rightContentAlignment}>
        <div className={styles.button}>
          <button onClick={onExport}>
            Export
            <ExportIcon />
          </button>
        </div>
        <Button text="Add New Sub-Admin" icon={<PlusIcon />} onClick={onAddClick} />
      </div>
    </div>
  );
}
