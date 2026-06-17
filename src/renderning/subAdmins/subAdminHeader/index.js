"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./subAdminHeader.module.scss";
import SearchIcon from "@/svg/searchIcon";
import ExportIcon from "@/svg/exportIcon";
import Button from "@/components/button";
import PlusIcon from "@/svg/plusIcon";

export default function SubAdminHeader({ onAddClick }) {
  return (
    <div className={styles.subAdminHeader}>
      <div className={styles.searchbar}>
        <input type="text" placeholder="Search" />
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
      </div>
      <div className={styles.rightContentAlignment}>
        <div className={styles.button}>
          <button>
            Export
            <ExportIcon />
          </button>
        </div>
        <Button text="Add New Sub-Admin" icon={<PlusIcon />} onClick={onAddClick} />
      </div>
    </div>
  );
}
