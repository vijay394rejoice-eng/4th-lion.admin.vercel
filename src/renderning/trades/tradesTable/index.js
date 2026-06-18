"use client";
import React, { useState, useEffect } from "react";
import styles from "./tradesTable.module.scss";
import DataTable from "@/components/dataTable";
import { getTrades } from "@/services/trades";
import TradeActionHeader from "../tradeActionHeader";
import { exportToCsv } from "@/utils/exportCsv";

export default function TradesTable({ refreshTrigger, onUploadSuccess, onManualEntryClick }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const pageSize = 10;

  const fetchTrades = async (page) => {
    setIsLoading(true);
    try {
      const res = await getTrades({ page, limit: pageSize, ...filters });
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
  }, [currentPage, refreshTrigger, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    exportToCsv(data, columns, "trades.csv");
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
      width: "12%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.entry_time || "-"
      )
    },
    { 
      header: "Exit Time", 
      accessor: "exit_time", 
      width: "12%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.exit_time || "-"
      )
    },
    { 
      header: "Position", 
      accessor: "position", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.position || "-"
      )
    },
    { 
      header: "Symbol", 
      accessor: "symbol", 
      width: "8%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        row.symbol || "-"
      )
    },
    { 
      header: "Type", 
      accessor: "trade_type", 
      width: "8%",
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
      width: "8%",
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
      width: "12%",
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
      width: "10%",
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
    }
  ];

  const tableData = isLoading ? skeletonData : data;

  return (
    <>
      <TradeActionHeader 
        onExport={handleExport} 
        onUploadSuccess={onUploadSuccess}
        onManualEntryClick={onManualEntryClick}
        onApplyFilters={setFilters}
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
    </>
  );
}
