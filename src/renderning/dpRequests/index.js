"use client";
import React, { useState } from 'react';
import DPRequestsTable from './dpRequestsTable';
import DPRequestsCard from './dpRequestsCard';

export default function DPRequests() {
    const [counts, setCounts] = useState({
        approvedPartnersCount: 0,
        pendingRequestsCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);

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
            <DPRequestsTable 
                onDataFetched={handleDataFetched}
                onLoadStart={handleLoadStart}
            />
        </div>
    );
}
