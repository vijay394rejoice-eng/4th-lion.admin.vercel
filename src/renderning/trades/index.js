"use client";
import React, { useState } from "react";
import TradesTable from "./tradesTable";
import AddTradeManualModal from "./addTradeManualModal";

export default function Trades() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showManualModal, setShowManualModal] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <TradesTable 
        refreshTrigger={refreshTrigger} 
        onUploadSuccess={handleUploadSuccess}
        onManualEntryClick={() => setShowManualModal(true)}
      />
      
      {showManualModal && (
        <AddTradeManualModal 
          onClose={() => setShowManualModal(false)} 
          onSuccess={handleUploadSuccess} 
        />
      )}
    </div>
  );
}
