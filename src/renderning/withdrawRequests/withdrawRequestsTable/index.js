"use client";
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import styles from "./withdrawRequestsTable.module.scss";
import DataTable from "@/components/dataTable";
import { getWithdrawRequests, approveWithdrawRequest, rejectWithdrawRequest, exportWithdrawalsApi } from "@/services/withdraw";
import LogoutModal from "@/components/logoutModal";
import toast from "react-hot-toast";
import { downloadFileFromResponse } from "@/utils/exportCsv";

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

const WithdrawRequestsTable = forwardRef(({ search, appliedFilters, onCountsChange }, ref) => {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal control states
  const [confirmType, setConfirmType] = useState(null); // 'approve' | 'reject' | null
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pageSize = 10;

  const fetchWithdrawRequests = async (page) => {
    setIsLoading(true);
    try {
      const params = { page, limit: pageSize };
      
      if (search) {
        params.search = search;
      }
      if (appliedFilters?.status) {
        params.status = appliedFilters.status;
      }
      if (appliedFilters?.minAmount) {
        params.min_amount = Number(appliedFilters.minAmount);
      }
      if (appliedFilters?.maxAmount) {
        params.max_amount = Number(appliedFilters.maxAmount);
      }
      if (appliedFilters?.startDate) {
        params.start_date = appliedFilters.startDate;
      }
      if (appliedFilters?.endDate) {
        params.end_date = appliedFilters.endDate;
      }

      const res = await getWithdrawRequests(params);
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
        if (onCountsChange) {
          onCountsChange({
            pendingCount: res.data?.pending_count || 0,
            approvedCount: res.data?.approved_count || 0
          });
        }
      }
    } catch (err) {
      console.error("Failed to load withdraw requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const prevSearchRef = useRef(search);
  const prevFiltersRef = useRef(appliedFilters);

  useEffect(() => {
    const searchChanged = prevSearchRef.current !== search;
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(appliedFilters);

    if (searchChanged || filtersChanged) {
      prevSearchRef.current = search;
      prevFiltersRef.current = appliedFilters;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return; // Don't fetch here; changing currentPage will trigger the effect again
      }
    }

    fetchWithdrawRequests(currentPage);
  }, [currentPage, search, appliedFilters]);

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
        res = await approveWithdrawRequest(selectedRequest.id);
      } else {
        res = await rejectWithdrawRequest(selectedRequest.id);
      }

      if (res && res.status === 1) {
        toast.success(res.message || `Withdraw request ${confirmType}d successfully`);
        setConfirmType(null);
        setSelectedRequest(null);
        fetchWithdrawRequests(currentPage);
      } else {
        toast.error(res?.message || `Failed to ${confirmType} withdraw request`);
      }
    } catch (err) {
      console.error(`Failed to ${confirmType} withdraw request:`, err);
      // toast.error(err?.message || `Something went wrong while processing the request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmType(null);
    setSelectedRequest(null);
  };

  useImperativeHandle(ref, () => ({
    async handleExport() {
      try {
        const payload = {};
        if (search) {
          payload.search = search;
        }
        if (appliedFilters?.status) {
          payload.status = appliedFilters.status;
        }
        if (appliedFilters?.minAmount) {
          payload.min_amount = Number(appliedFilters.minAmount);
        }
        if (appliedFilters?.maxAmount) {
          payload.max_amount = Number(appliedFilters.maxAmount);
        }
        if (appliedFilters?.startDate) {
          payload.start_date = appliedFilters.startDate;
        }
        if (appliedFilters?.endDate) {
          payload.end_date = appliedFilters.endDate;
        }

        const response = await exportWithdrawalsApi(payload);
        downloadFileFromResponse(response, "withdraw_requests.csv");
      } catch (err) {
        toast.error("Failed to export withdraw requests");
      }
    }
  }));

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
      width: "15%",
      csvCell: (row) => `${row.first_name || ""} ${row.last_name || ""} (${row.email || ""})`.trim(),
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <div title={`${row.first_name || ""} ${row.last_name || ""} (${row.email || ""})`}>
            <div style={{ fontWeight: 600 }}>
              {row.first_name} {row.last_name}
            </div>
            <div style={{ fontSize: "0.85em", color: "#666" }}>
              {row.email}
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
      header: "Wallet ID",
      accessor: "wallet_id",
      width: "12%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <span className={styles.walletIdText} title={row.wallet_id}>
            {row.wallet_id}
          </span>
        ),
    },
    {
      header: "Amount",
      accessor: "amount",
      width: "8%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
        ) : (
          <span style={{ fontWeight: 600 }}>{row.amount}</span>
        ),
    },
    {
      header: "Network",
      accessor: "network",
      width: "8%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          row.network || "-"
        ),
    },
    {
      header: "Crypto Wallet Address",
      accessor: "crypto_wallet_address",
      width: "14%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          <span className={styles.walletIdText} title={row.crypto_wallet_address}>
            {row.crypto_wallet_address || "-"}
          </span>
        ),
    },
    {
      header: "Remarks",
      accessor: "remarks",
      width: "10%",
      cell: (row) =>
        row.isSkeleton ? (
          <span className={`${styles.skeleton} ${styles.text}`} />
        ) : (
          row.remarks || "-"
        ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "8%",
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
      </div>

      {confirmType && selectedRequest && (
        <LogoutModal
          message={
            confirmType === "approve"
              ? `Are you sure you want to approve the withdraw request of ${selectedRequest.amount}?`
              : `Are you sure you want to reject the withdraw request of ${selectedRequest.amount}?`
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
});

WithdrawRequestsTable.displayName = "WithdrawRequestsTable";
export default WithdrawRequestsTable;
