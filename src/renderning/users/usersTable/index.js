"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./usersTable.module.scss";
import DataTable from "@/components/dataTable";
import { getUsers, blockUser, unblockUser } from "@/services/user";
import LogoutModal from "@/components/logoutModal";
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

export default function UsersTable({ search, appliedFilters }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal control states
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // 'block' | 'unblock' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  const fetchUsers = async (page) => {
    setIsLoading(true);
    try {
      const params = { page, limit: pageSize };
      
      if (search) {
        params.search = search;
      }

      // role filter: role should be "USER" and "PARTNER"
      // If only one role is selected, we filter by it. If both or none are selected, we omit to fetch all.
      if (appliedFilters?.roles && appliedFilters.roles.length === 1) {
        params.role = appliedFilters.roles[0];
      }

      // status filter: status should be true or false, this is for is_active
      // If exactly one of 'active' or 'inactive' is selected, we filter by it. If 'all' is selected, we omit it.
      if (appliedFilters?.statuses && appliedFilters.statuses.length === 1) {
        const status = appliedFilters.statuses[0];
        if (status === "active" || status === "inactive") {
          params.is_active = status === "active";
        }
      }

      const res = await getUsers(params);
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

  // Track previous search/filters to detect when they change
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

    fetchUsers(currentPage);
  }, [currentPage, search, appliedFilters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleToggleBlockClick = (user, action) => {
    setSelectedUser(user);
    setConfirmAction(action);
  };

  const handleConfirmToggleBlock = async () => {
    if (!selectedUser || !confirmAction) return;
    setIsSubmitting(true);
    try {
      let res;
      if (confirmAction === "block") {
        res = await blockUser(selectedUser.id);
      } else {
        res = await unblockUser(selectedUser.id);
      }

      if (res && res.status === 1) {
        toast.success(res.message || `User ${confirmAction}ed successfully`);
        setConfirmAction(null);
        setSelectedUser(null);
        fetchUsers(currentPage);
      } else {
        toast.error(res?.message || `Failed to ${confirmAction} user`);
      }
    } catch (err) {
      console.error(`Failed to ${confirmAction} user:`, err);
      toast.error(err?.message || `Something went wrong while trying to ${confirmAction} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelToggleBlock = () => {
    setConfirmAction(null);
    setSelectedUser(null);
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
      width: "13%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.created_at ? formatDate(row.created_at) : "-"
      )
    },
    { 
      header: "Name", 
      accessor: "name", 
      width: "14%", 
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
      width: "15%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.email
      )
    },
    { 
      header: "Partner", 
      accessor: "partner", 
      width: "9%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.role === "PARTNER" ? "Yes" : "No"
      )
    },
    { 
      header: "Profit", 
      accessor: "profit", 
      width: "9%", 
      className: styles.profit,
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.profit || "-"
      )
    },
    { 
      header: "Investment Account ID", 
      accessor: "investment_account_id", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.investment_account_id || "-"
      )
    },
    { 
      header: "PNL", 
      accessor: "pnl", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.pnl || "-"
      )
    },
    { 
      header: "Invested Value", 
      accessor: "invested_value", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.invested_value || "-"
      )
    },
    { 
      header: "Action", 
      width: "10%", 
      cell: (row) => {
        if (row.isSkeleton) {
          return <span className={`${styles.skeleton} ${styles.badge}`} />;
        }
        const isBlocked = row.is_active === false;
        return isBlocked ? (
          <button 
            className={styles.unblockBtn}
            onClick={() => handleToggleBlockClick(row, "unblock")}
          >
            Unblock
          </button>
        ) : (
          <button 
            className={styles.blockBtn}
            onClick={() => handleToggleBlockClick(row, "block")}
          >
            Block
          </button>
        );
      } 
    }
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

      {confirmAction && selectedUser && (
        <LogoutModal
          message={`Are you sure you want to ${confirmAction} this user (${selectedUser.first_name || ""} ${selectedUser.last_name || ""})?`}
          confirmText={confirmAction === "block" ? "Block" : "Unblock"}
          confirmIcon={confirmAction === "block" ? "/assets/icons/block.svg" : "/assets/icons/right.svg"}
          danger={confirmAction === "block"}
          onConfirm={handleConfirmToggleBlock}
          onCancel={handleCancelToggleBlock}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
