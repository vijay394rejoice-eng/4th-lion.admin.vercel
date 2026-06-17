"use client";
import React, { useState } from "react";
import AddNewSubAdmin from "@/components/addNewSubAdmin";
import SubAdminsTable from "./subAdminsTable";
import SubAdminHeader from "./subAdminHeader";

export default function SubAdmins() {
  const [modalMode, setModalMode] = useState(null); // null, 'add', or sub-admin row object
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <SubAdminHeader onAddClick={() => setModalMode("add")} />
      <SubAdminsTable refreshKey={refreshKey} onEditClick={(row) => setModalMode(row)} />
      
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
