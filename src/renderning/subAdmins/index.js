"use client";
import React, { useState } from "react";
import AddNewSubAdmin from "@/components/addNewSubAdmin";
import SubAdminsTable from "./subAdminsTable";
import SubAdminHeader from "./subAdminHeader";

export default function SubAdmins() {
  const [modalMode, setModalMode] = useState(null); // null, 'add', or sub-admin row object
  const [refreshKey, setRefreshKey] = useState(0);
  const [emailFilter, setEmailFilter] = useState("");
  const [exportTrigger, setExportTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <SubAdminHeader 
        email={emailFilter} 
        onEmailChange={setEmailFilter} 
        onExport={() => setExportTrigger((prev) => prev + 1)}
        onAddClick={() => setModalMode("add")} 
      />
      <SubAdminsTable 
        email={emailFilter} 
        refreshKey={refreshKey} 
        exportTrigger={exportTrigger}
        onEditClick={(row) => setModalMode(row)} 
      />
      
      {modalMode && (
        <AddNewSubAdmin 
          subAdmin={modalMode === "add" ? null : modalMode}
          onClose={() => setModalMode(null)} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}
