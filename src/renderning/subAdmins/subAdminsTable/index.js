"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./kycRequestsTable.module.scss";
import DataTable from "@/components/dataTable";
import { getSubAdmins, exportSubAdminsApi } from "@/services/subAdmin";
import { downloadFileFromResponse } from "@/utils/exportCsv";
import toast from "react-hot-toast";

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

export default function SubAdminsTable({ email, refreshKey, exportTrigger, onEditClick }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 10;

  const fetchSubAdmins = async (page) => {
    setIsLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (email) {
        params.email = email;
      }
      const res = await getSubAdmins(params);
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load sub-admins:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Track previous email to detect changes and reset page to 1
  const prevEmailRef = useRef(email);

  useEffect(() => {
    const emailChanged = prevEmailRef.current !== email;
    if (emailChanged) {
      prevEmailRef.current = email;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return; // Don't fetch here; changing currentPage will trigger the effect again
      }
    }

    fetchSubAdmins(currentPage);
  }, [currentPage, refreshKey, email]);

  // Export to CSV when exportTrigger changes
  useEffect(() => {
    if (exportTrigger > 0) {
      const handleExport = async () => {
        try {
          const payload = {};
          if (email) {
            payload.email = email;
          }
          const response = await exportSubAdminsApi(payload);
          downloadFileFromResponse(response, "sub_admins.csv");
        } catch (err) {
          toast.error("Failed to export sub-admins");
        }
      };
      handleExport();
    }
  }, [exportTrigger]);

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
      header: "Created At",
      accessor: "created_at",
      width: "18%",
      csvCell: (row) => row.created_at ? formatDate(row.created_at) : "-",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : row.created_at ? (
          formatDate(row.created_at)
        ) : (
          "-"
        ),
    },
    {
      header: "Admin ID",
      accessor: "id",
      width: "20%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <span className={styles.userIdText} title={row.id}>
            {row.id}
          </span>
        ),
    },
    {
      header: "Email",
      accessor: "email",
      width: "20%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <span className={styles.emailText} title={row.email}>
            {row.email}
          </span>
        ),
    },
    {
      header: "Name",
      accessor: "name",
      width: "20%",
      csvCell: (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim() || "-",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <span
            className={styles.nameText}
            title={`${row.first_name || ""} ${row.last_name || ""}`}
          >
            {`${row.first_name || ""} ${row.last_name || ""}`.trim() || "-"}
          </span>
        ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "12%",
      csvCell: (row) => row.status || "-",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.badge}`} />
        ) : (
          <span
            className={`${styles.statusBadge} ${styles[row.status?.toLowerCase()] || ""}`}
          >
            {row.status}
          </span>
        ),
    },
    {
      header: "Action",
      width: "8%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.badge}`} />
        ) : (
          <button className={styles.viewBtn} onClick={() => onEditClick && onEditClick(row)}>
            View
          </button>
        ),
    },
  ];

  const tableData = isLoading ? skeletonData : data;

  return (
    <>
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
    </>
  );
}
