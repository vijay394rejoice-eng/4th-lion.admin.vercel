"use client";
import React, { useState } from 'react';
import DPRequestsTable from './dpRequestsTable';
import DPRequestsCard from './dpRequestsCard';
import DPRequestsActionHeader from './dpRequestsActionHeader';

export default function DPRequests() {
    const [counts, setCounts] = useState({
        approvedPartnersCount: 0,
        pendingRequestsCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const handleDataFetched = (fetchedCounts) => {
        setCounts(fetchedCounts);
        setIsLoading(false);
    };

    const handleLoadStart = () => {
        setIsLoading(true);
    };

    return (
        <div>
            <DPRequestsCard 
                pendingCount={counts.pendingRequestsCount}
                approvedCount={counts.approvedPartnersCount}
                isLoading={isLoading}
            />
            <DPRequestsActionHeader onApplyFilters={setFilters} />
            <DPRequestsTable 
                onDataFetched={handleDataFetched}
                onLoadStart={handleLoadStart}
                filters={filters}
            />
        </div>
    );
}
