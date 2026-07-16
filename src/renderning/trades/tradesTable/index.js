"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./tradesTable.module.scss";
import DataTable from "@/components/dataTable";
import { getTrades, deleteTrade, exportTradesApi } from "@/services/trades";
import TradeActionHeader from "../tradeActionHeader";
import { downloadFileFromResponse } from "@/utils/exportCsv";
import LogoutModal from "@/components/logoutModal";
import EditTradeModal from "../editTradeModal";
import toast from "react-hot-toast";

export default function TradesTable({ refreshTrigger, onUploadSuccess, onManualEntryClick }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  // Deletion states
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit states
  const [editTrade, setEditTrade] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const pageSize = 10;

  const fetchTrades = async (page) => {
    setIsLoading(true);
    try {
      const params = { page, limit: pageSize, ...filters };
      if (search) {
        params.search = search;
      }
      const res = await getTrades(params);
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load trades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades(currentPage);
  }, [currentPage, refreshTrigger, filters, search]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleExport = async () => {
    try {
      const payload = { search, ...filters };
      const response = await exportTradesApi(payload);
      downloadFileFromResponse(response, "trades.csv");
    } catch (err) {
      toast.error("Failed to export trades");
    }
  };

  const handleEditClick = (trade) => {
    setEditTrade(trade);
    setShowEditModal(true);
  };

  const handleDeleteClick = (trade) => {
    setSelectedTrade(trade);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTrade) return;
    setIsDeleting(true);
    try {
      const res = await deleteTrade(selectedTrade.id);
      if (res && res.status === 1) {
        toast.success(res.message || "Trade deleted successfully!");
        setShowDeleteModal(false);
        setSelectedTrade(null);
        fetchTrades(currentPage);
      } else {
        toast.error(res?.message || "Failed to delete trade");
      }
    } catch (err) {
      console.error("Failed to delete trade:", err);
      // toast.error is handled by api.js globally on error
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate 10 skeleton rows when loading to align columns nicely
  const skeletonData = Array.from({ length: pageSize }, (_, index) => ({
    id: `skeleton-${index}`,
    isSkeleton: true,
  }));

  const columns = [
    { 
      header: "Entry Time", 
      accessor: "entry_time", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.entry_time || "-"
      )
    },
    { 
      header: "Exit Time", 
      accessor: "exit_time", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.exit_time || "-"
      )
    },
    { 
      header: "Position", 
      accessor: "position", 
      width: "9%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.position || "-"
      )
    },
    { 
      header: "Symbol", 
      accessor: "symbol", 
      width: "7%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.symbol || "-"
      )
    },
    { 
      header: "Type", 
      accessor: "trade_type", 
      width: "7%",
      csvCell: (row) => row.trade_type ? row.trade_type.toUpperCase() : "-",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.trade_type ? row.trade_type.toUpperCase() : "-"
      )
    },
    { 
      header: "Volume", 
      accessor: "volume", 
      width: "7%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.volume !== null && row.volume !== undefined ? row.volume : "-"
      )
    },
    { 
      header: "Entry Price", 
      accessor: "entry_price", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.entry_price || "-"
      )
    },
    { 
      header: "Exit Price", 
      accessor: "exit_price", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.exit_price || "-"
      )
    },
    { 
      header: "Profit", 
      accessor: "profit", 
      width: "8%",
      csvCell: (row) => row.profit !== null && row.profit !== undefined ? row.profit : "-",
      cell: (row) => {
        if (row.isSkeleton) {
          return <span className={`${styles.skeleton} ${styles.text}`} />;
        }
        if (row.profit === null || row.profit === undefined) return "-";
        const val = Number(row.profit);
        const className = val > 0 ? styles.profitPositive : val < 0 ? styles.profitNegative : "";
        return <span className={className}>{val}</span>;
      }
    },
    { 
      header: "Profit %", 
      accessor: "profit_percent", 
      width: "8%",
      csvCell: (row) => row.profit_percent !== null && row.profit_percent !== undefined ? `${row.profit_percent}%` : "-",
      cell: (row) => {
        if (row.isSkeleton) {
          return <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />;
        }
        if (row.profit_percent === null || row.profit_percent === undefined) return "-";
        const val = Number(row.profit_percent);
        const className = val > 0 ? styles.profitPositive : val < 0 ? styles.profitNegative : "";
        return <span className={className}>{val}%</span>;
      }
    },
    {
      header: "Action",
      width: "14%",
      cell: (row) => {
        if (row.isSkeleton) {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <span className={`${styles.skeleton} ${styles.badge}`} style={{ width: "45px" }} />
              <span className={`${styles.skeleton} ${styles.badge}`} style={{ width: "55px" }} />
            </div>
          );
        }

        if (row.is_settled) {
          return (
            <span style={{ 
              backgroundColor: '#ECFDF5', 
              color: '#059669', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: '600',
              display: 'inline-block'
            }}>
              Trade Settled
            </span>
          );
        }

        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className={styles.viewBtn}
              onClick={() => handleEditClick(row)}
            >
              Edit
            </button>
            <button 
              className={styles.blockBtn}
              onClick={() => handleDeleteClick(row)}
            >
              Delete
            </button>
          </div>
        );
      }
    }
  ];

  const tableData = isLoading ? skeletonData : data;

  return (
    <>
      <TradeActionHeader 
        onExport={handleExport} 
        onUploadSuccess={onUploadSuccess}
        onManualEntryClick={onManualEntryClick}
        onApplyFilters={handleApplyFilters}
        search={search}
        onSearchChange={handleSearchChange}
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

      {showDeleteModal && selectedTrade && (
        <LogoutModal
          message={`Are you sure you want to delete this trade (Position ID: ${selectedTrade.position})?`}
          confirmText="Delete"
          confirmIcon="/assets/icons/close.svg"
          danger={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedTrade(null);
          }}
          isSubmitting={isDeleting}
        />
      )}

      {showEditModal && editTrade && (
        <EditTradeModal
          trade={editTrade}
          onClose={() => {
            setShowEditModal(false);
            setEditTrade(null);
          }}
          onSuccess={() => {
            fetchTrades(currentPage);
          }}
        />
      )}
    </>
  );
}
