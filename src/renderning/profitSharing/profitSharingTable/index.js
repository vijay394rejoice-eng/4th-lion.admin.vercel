"use client";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./profitSharingTable.module.scss";
import DataTable from "@/components/dataTable";
import { getProfitSharing } from "@/services/profitSharing";
import { exportToCsv } from "@/utils/exportCsv";

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

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "$0.00";
  const num = Number(value);
  if (isNaN(num)) return value;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ProfitSharingTable = forwardRef(
  ({ search, appliedFilters, onCountsChange }, ref) => {
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 10;

    const fetchProfitSharing = async (page) => {
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

        const res = await getProfitSharing(params);
        if (res && res.status === 1) {
          setData(res.data?.items || []);
          setTotalItems(res.data?.total || 0);
          if (onCountsChange) {
            onCountsChange({
              pendingCount: res.data?.pending_count || 0,
              approvedCount: res.data?.approved_count || 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profit sharing:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const prevSearchRef = useRef(search);
    const prevFiltersRef = useRef(appliedFilters);

    useEffect(() => {
      const searchChanged = prevSearchRef.current !== search;
      const filtersChanged =
        JSON.stringify(prevFiltersRef.current) !==
        JSON.stringify(appliedFilters);

      if (searchChanged || filtersChanged) {
        prevSearchRef.current = search;
        prevFiltersRef.current = appliedFilters;
        if (currentPage !== 1) {
          setCurrentPage(1);
          return; // Don't fetch here; changing currentPage will trigger the effect again
        }
      }

      fetchProfitSharing(currentPage);
    }, [currentPage, search, appliedFilters]);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    useImperativeHandle(ref, () => ({
      handleExport() {
        exportToCsv(data, columns, "profit_sharing.csv");
      },
    }));

    // Generate 10 skeleton rows when loading to align columns nicely
    const skeletonData = Array.from({ length: pageSize }, (_, index) => ({
      id: `skeleton-${index}`,
      isSkeleton: true,
    }));

    const columns = [
      {
        header: "Date Joined",
        accessor: "date_joined",
        width: "15%",
        csvCell: (row) => row.date_joined,
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text}`} />
          ) : (
            row.date_joined
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
        header: "Name",
        width: "15%",
        csvCell: (row) => `${row.name}`.trim(),
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text}`} />
          ) : (
            <div style={{ fontWeight: 600 }}>
              {row.name}
            </div>
          ),
      },
      {
        header: "Email",
        accessor: "email",
        width: "15%",
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text}`} />
          ) : (
            row.email
          ),
      },
      {
        header: "Partner",
        accessor: "partner",
        width: "8%",
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
          ) : (
            row.partner || "-"
          ),
      },
      {
        header: "Users Profit",
        accessor: "user_profit",
        width: "12%",
        csvCell: (row) => formatCurrency(row.user_profit),
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
          ) : (
            <span style={{ fontWeight: 600 }}>{formatCurrency(row.user_profit)}</span>
          ),
      },
      {
        header: "Profit %",
        accessor: "profit_percentage",
        width: "10%",
        csvCell: (row) => row.profit_percentage !== undefined ? `${row.profit_percentage}%` : "-",
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
          ) : (
            row.profit_percentage !== undefined ? `${row.profit_percentage}` : "-"
          ),
      },
      {
        header: "My Share",
        accessor: "my_share",
        width: "13%",
        csvCell: (row) => formatCurrency(row.my_share),
        cell: (row) =>
          row.isSkeleton ? (
            <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
          ) : (
            <span style={{ fontWeight: 600 }}>{formatCurrency(row.my_share)}</span>
          ),
      },
    ];

    const tableData = isLoading ? skeletonData : data;

    return (
      <>
        <div className={styles.profitSharingTable}>
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
      </>
    );
  },
);

ProfitSharingTable.displayName = "ProfitSharingTable";
export default ProfitSharingTable;
