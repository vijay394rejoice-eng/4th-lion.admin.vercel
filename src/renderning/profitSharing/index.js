"use client";
import React, { useState, useRef } from "react";
import ProfitSharingTable from "./profitSharingTable";
import ProfitSharingActionHeader from "./profitSharingActionHeader";

export default function ProfitSharing() {
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
      <ProfitSharingActionHeader 
        search={search}
        onSearchChange={setSearch}
        appliedFilters={appliedFilters}
        onApplyFilters={setAppliedFilters}
        onExport={() => tableRef.current?.handleExport()}
      />
      <ProfitSharingTable 
        ref={tableRef}
        search={search}
        appliedFilters={appliedFilters}
        onCountsChange={setCounts}
      />
    </div>
  );
}
