"use client";
import React, { useState } from 'react'
import UsersTable from './usersTable'
import UserActionHeader from './userActionHeader'

export default function Users() {
    const [search, setSearch] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        roles: [],      // array containing 'USER' and/or 'PARTNER'
        statuses: [],   // array containing 'active' and/or 'inactive'
    });

    return (
        <div>
            <UserActionHeader 
                search={search}
                onSearchChange={setSearch}
                appliedFilters={appliedFilters}
                onApplyFilters={setAppliedFilters}
            />
            <UsersTable 
                search={search}
                appliedFilters={appliedFilters}
            />
            {/* <ApproveRequest /> */}
        </div>
    )
}
