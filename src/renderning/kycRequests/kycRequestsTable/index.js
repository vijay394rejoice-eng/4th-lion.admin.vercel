"use client";
import React, { useState, useEffect } from "react";
import styles from "./kycRequestsTable.module.scss";
import DataTable from "@/components/dataTable";
import { getKYCRequests } from "@/services/kyc";

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

export default function KycRequestsTable() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pageSize = 10;

  const fetchKycRequests = async (page) => {
    setIsLoading(true);
    try {
      const res = await getKYCRequests({ page, limit: pageSize });
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load KYC requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKycRequests(currentPage);
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
      header: "Created At",
      accessor: "created_at",
      width: "18%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          formatDate(row.created_at)
        ),
    },
    {
      header: "User ID",
      accessor: "user_id",
      width: "20%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <span className={styles.userIdText} title={row.user_id}>
            {row.user_id}
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
      header: "Role",
      accessor: "role",
      width: "10%",
      cell: (row) =>
        row.isSkeleton ? (
          <span
            className={`${styles.skeleton} ${styles.text} ${styles.short}`}
          />
        ) : (
          <span className={styles.roleText}>{row.role}</span>
        ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "12%",
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
      header: "Remarks",
      accessor: "remarks",
      width: "14%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          row.remarks || "-"
        ),
    },
    {
      header: "Action",
      width: "8%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.badge}`} />
        ) : (
          <button
            className={styles.viewBtn}
            onClick={() => setSelectedRequest(row)}
          >
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
