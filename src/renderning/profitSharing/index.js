import React from "react";
import ProfitSharingTable from "./profitSharingTable";
import ProfitSharingCard from "./profitSharingCard";
import ActionSection from "./actionSection";

export default function ProfitSharing() {
  return (
    <div>
      <ProfitSharingCard />
      <ActionSection />
      <ProfitSharingTable />
    </div>
  );
}
