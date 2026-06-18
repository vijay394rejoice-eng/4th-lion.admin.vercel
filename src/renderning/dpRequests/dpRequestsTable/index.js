"use client";
import React, { useState, useEffect } from "react";
import styles from "./dpRequestsTable.module.scss";
import DataTable from "@/components/dataTable";
import { getPartnerRequests, approvePartnerRequest, rejectPartnerRequest } from "@/services/dpRequests";
import LogoutModal from "@/components/logoutModal";
import DPRequestsActionHeader from "../dpRequestsActionHeader";
import { exportToCsv } from "@/utils/exportCsv";
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

export default function DPRequestsTable({ onDataFetched, onLoadStart }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({});
  
  // Modal control states
  const [confirmType, setConfirmType] = useState(null); // 'approve' | 'reject' | null
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pageSize = 10;

  const fetchPartnerRequests = async (page) => {
    setIsLoading(true);
    if (onLoadStart) onLoadStart();
    try {
      const res = await getPartnerRequests({ page, limit: pageSize, ...filters });
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
        if (onDataFetched) {
          onDataFetched({
            approvedPartnersCount: res.data?.approved_partners_count || 0,
            pendingRequestsCount: res.data?.pending_requests_count || 0,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load partner requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerRequests(currentPage);
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setConfirmType(type);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !confirmType) return;
    setIsSubmitting(true);
    try {
      let res;
      if (confirmType === "approve") {
        res = await approvePartnerRequest(selectedRequest.id);
      } else {
        res = await rejectPartnerRequest(selectedRequest.id);
      }

      if (res && res.status === 1) {
        toast.success(res.message || `Partner request ${confirmType}d successfully`);
        setConfirmType(null);
        setSelectedRequest(null);
        fetchPartnerRequests(currentPage);
      } else {
        toast.error(res?.message || `Failed to ${confirmType} partner request`);
      }
    } catch (err) {
      console.error(`Failed to ${confirmType} partner request:`, err);
      toast.error(err?.message || `Something went wrong while processing the request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmType(null);
    setSelectedRequest(null);
  };

  const handleExport = () => {
    exportToCsv(data, columns, "partner_requests.csv");
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
      width: "15%",
      csvCell: (row) => formatDate(row.created_at),
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          formatDate(row.created_at)
        ),
    },
    {
      header: "User",
      width: "18%",
      csvCell: (row) => `${row.first_name || ""} ${row.last_name || ""} (${row.email || ""})`,
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <div title={`${row.first_name || ""} ${row.last_name || ""} (${row.email || ""})`}>
            <div style={{ fontWeight: 600 }}>
              {row.first_name || "-"} {row.last_name || ""}
            </div>
            <div style={{ fontSize: "0.85em", color: "#666" }}>
              {row.email || "-"}
            </div>
          </div>
        ),
    },
    {
      header: "Request ID",
      accessor: "id",
      width: "12%",
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
      header: "User ID",
      accessor: "user_id",
      width: "12%",
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
      header: "Referral Code",
      accessor: "referral_code",
      width: "10%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
        ) : (
          <span style={{ fontWeight: 600 }}>{row.referral_code || "-"}</span>
        ),
    },
    {
      header: "Referred By",
      accessor: "referred_by_partner_id",
      width: "13%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          row.referred_by_partner_id || "-"
        ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "10%",
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
      width: "10%",
      cell: (row) =>
        row.isSkeleton ? (
          <div className={styles.actionBtnGroup}>
            <span className={`${styles.skeleton} ${styles.badge}`} style={{ width: "45px" }} />
            <span className={`${styles.skeleton} ${styles.badge}`} style={{ width: "45px" }} />
          </div>
        ) : row.status === "PENDING" ? (
          <div className={styles.actionBtnGroup}>
            <button
              className={styles.approveBtn}
              onClick={() => handleActionClick(row, "approve")}
            >
              Approve
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => handleActionClick(row, "reject")}
            >
              Reject
            </button>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const tableData = isLoading ? skeletonData : data;

  return (
    <>
      <DPRequestsActionHeader 
        onApplyFilters={setFilters} 
        onExport={handleExport} 
      />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={tableData}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          minWidth="1200px"
        />
      </div>

      {confirmType && selectedRequest && (
        <LogoutModal
          message={
            confirmType === "approve"
              ? `Are you sure you want to approve the partner request for ${selectedRequest.first_name || ""} ${selectedRequest.last_name || ""}?`
              : `Are you sure you want to reject the partner request for ${selectedRequest.first_name || ""} ${selectedRequest.last_name || ""}?`
          }
          confirmText={confirmType === "approve" ? "Approve" : "Reject"}
          confirmIcon={confirmType === "approve" ? "/assets/icons/right.svg" : "/assets/icons/close.svg"}
          danger={confirmType === "reject"}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
