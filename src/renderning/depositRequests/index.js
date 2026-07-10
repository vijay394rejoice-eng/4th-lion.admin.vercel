"use client";
import React, { useState, useRef } from 'react'
import DepositRequestsTable from './depositRequestsTable'
import DepositActionHeader from './depositActionHeader'

export default function DepositRequests() {
    const [search, setSearch] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        status: "",
        startDate: "",
        endDate: ""
    });
    const tableRef = useRef();

    return (
        <div>
            <DepositActionHeader 
                search={search}
                onSearchChange={setSearch}
                appliedFilters={appliedFilters}
                onApplyFilters={setAppliedFilters}
                onExport={() => tableRef.current?.handleExport()}
            />
            <DepositRequestsTable 
                ref={tableRef}
                search={search}
                appliedFilters={appliedFilters}
            />
        </div>
    )
}
