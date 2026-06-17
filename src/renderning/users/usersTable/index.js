"use client";
import React, { useState, useEffect } from "react";
import styles from "./usersTable.module.scss";
import DataTable from "@/components/dataTable";
import { getUsers } from "@/services/user";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // Format: DD-MM-YYYY | HH:MM AM/PM
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} | ${strHours}:${minutes} ${ampm}`;
  } catch (error) {
    return dateString;
  }
};

export default function UsersTable() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 10;

  const fetchUsers = async (page) => {
    setIsLoading(true);
    try {
      const res = await getUsers({ page, limit: pageSize });
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate 10 skeleton rows when loading to align columns nicely
  const skeletonData = Array.from({ length: pageSize }, (_, index) => ({
    id: `skeleton-${index}`,
    isSkeleton: true,
  }));

  const columns = [
    { 
      header: "Date Joined", 
      accessor: "created_at", 
      width: "18%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.created_at ? formatDate(row.created_at) : "-"
      )
    },
    { 
      header: "User ID", 
      accessor: "id", 
      width: "18%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        <span className={styles.userIdText} title={row.id}>
          {row.id}
        </span>
      )
    },
    { 
      header: "Name", 
      accessor: "name", 
      width: "16%", 
      className: styles.name,
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        `${row.first_name || ""} ${row.last_name || ""}`.trim() || "-"
      )
    },
    { 
      header: "Email", 
      accessor: "email", 
      width: "20%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.email
      )
    },
    { 
      header: "Partner", 
      accessor: "partner", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.role === "PARTNER" ? "Yes" : "No"
      )
    },
    { 
      header: "Profit", 
      accessor: "profit", 
      width: "10%", 
      className: styles.profit,
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.profit || "-"
      )
    },
    { 
      header: "Action", 
      width: "8%", 
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.badge}`} />
      ) : (
        <button className={styles.viewBtn}>
          View
        </button>
      ) 
    }
  ];

  const tableData = isLoading ? skeletonData : data;

  return (
    <div className={styles.tableContainer}>
      <DataTable 
        columns={columns} 
        data={tableData} 
        pageSize={pageSize} 
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
