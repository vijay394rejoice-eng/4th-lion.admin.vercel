"use client";
import React, { useState, useRef } from "react";
import WithdrawRequestsCard from "./withdrawRequestsCard";
import WithdrawRequestsTable from "./withdrawRequestsTable";
import WithdrawActionHeader from "./withdrawActionHeader";

export default function WithdrawRequests() {
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: ""
  });
  
  const [counts, setCounts] = useState({ pendingCount: 0, approvedCount: 0 });
  const tableRef = useRef();

  return (
    <div>
      <WithdrawRequestsCard 
        pendingCount={counts.pendingCount}
        approvedCount={counts.approvedCount}
      />
      <WithdrawActionHeader 
        search={search}
        onSearchChange={setSearch}
        appliedFilters={appliedFilters}
        onApplyFilters={setAppliedFilters}
        onExport={() => tableRef.current?.handleExport()}
      />
      <WithdrawRequestsTable 
        ref={tableRef}
        search={search}
        appliedFilters={appliedFilters}
        onCountsChange={setCounts}
      />
    </div>
  );
}
