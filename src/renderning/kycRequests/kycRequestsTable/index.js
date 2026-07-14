"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./kycRequestsTable.module.scss";
import DataTable from "@/components/dataTable";
import { getKYCRequests, approveKYC, rejectKYC, exportKycRequestsApi } from "@/services/kyc";
import KycPreview from "@/components/kycPreview";
import toast from "react-hot-toast";
import ActionHeader from "@/components/actionHeader";
import { downloadFileFromResponse } from "@/utils/exportCsv";
import KycActionHeader from "../kycActionHeader";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  console.log("KYC Requests data:", selectedRequest); // Debug log to check data structure

  const handleApprove = async (requestId, remarks) => {
    setIsSubmitting(true);
    try {
      const res = await approveKYC(requestId, { remarks });
      if (res && res.status === 1) {
        toast.success(res.message || "KYC request approved successfully");
        setSelectedRequest(null);
        fetchKycRequests(currentPage);
      } else {
        toast.error(res?.message || "Failed to approve KYC");
      }
    } catch (err) {
      console.error("Failed to approve KYC:", err);
      // toast.error(err?.message || "Something went wrong while approving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (requestId, remarks) => {
    setIsSubmitting(true);
    try {
      const res = await rejectKYC(requestId, { remarks });
      if (res && res.status === 1) {
        toast.success(res.message || "KYC request rejected successfully");
        setSelectedRequest(null);
        fetchKycRequests(currentPage);
      } else {
        toast.error(res?.message || "Failed to reject KYC");
      }
    } catch (err) {
      console.error("Failed to reject KYC:", err);
      // toast.error(err?.message || "Something went wrong while rejecting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageSize = 10;

  const fetchKycRequests = async (page) => {
    setIsLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (search) {
        params.search = search;
      }
      if (status) {
        params.status = status;
      }
      const res = await getKYCRequests(params);
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
  }, [currentPage, search, status]);

  const handleSearchChange = useCallback((newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleExport = async () => {
    try {
      const payload = { search, status };
      const response = await exportKycRequestsApi(payload);
      downloadFileFromResponse(response, "kyc_requests.csv");
    } catch (err) {
      toast.error("Failed to export KYC requests");
    }
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
      width: "13%",
      csvCell: (row) => formatDate(row.created_at),
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
      width: "14%",
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
      width: "16%",
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
      width: "16%",
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
      header: "Role",
      accessor: "role",
      width: "8%",
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
      header: "Remarks",
      accessor: "remarks",
      width: "15%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <div className={styles.remarksCell} title={row.remarks}>
            {row.remarks || "-"}
          </div>
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
      <KycActionHeader
        onExport={handleExport}
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
      />
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={tableData}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          minWidth="1300px"
        />
        {selectedRequest && (
          <KycPreview
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </>
  );
}
