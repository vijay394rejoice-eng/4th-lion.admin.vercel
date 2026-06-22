"use client";
import React, { useState, useRef } from 'react'
import UsersTable from './usersTable'
import UserActionHeader from './userActionHeader'

export default function Users() {
    const [search, setSearch] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        roles: [],      // array containing 'USER' and/or 'PARTNER'
        statuses: [],   // array containing 'active' and/or 'inactive'
    });
    
    const tableRef = useRef();

    return (
        <div>
            <UserActionHeader 
                search={search}
                onSearchChange={setSearch}
                appliedFilters={appliedFilters}
                onApplyFilters={setAppliedFilters}
                onExport={() => tableRef.current?.handleExport()}
            />
            <UsersTable 
                ref={tableRef}
                search={search}
                appliedFilters={appliedFilters}
            />
            {/* <ApproveRequest /> */}
        </div>
    )
}
