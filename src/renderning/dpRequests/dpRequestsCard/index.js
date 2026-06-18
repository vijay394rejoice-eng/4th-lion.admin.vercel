import React from "react";
import styles from "./dpRequestsCard.module.scss";
import DolorIcon from "@/svg/dolorIcon";
export default function DPRequestsCard({ pendingCount = 0, approvedCount = 0, isLoading = false }) {
  return (
    <div className={styles.dpRequestsCard}>
      <div className={styles.items}>
        <div className={styles.icon}>
          <DolorIcon />
        </div>
        <h3>Pending Requests</h3>
        {isLoading ? (
          <span className={styles.skeletonVal} />
        ) : (
          <p>{pendingCount}</p>
        )}
      </div>
      <div className={styles.items}>
        <div className={styles.icon}>
          <DolorIcon />
        </div>
        <h3>Approved Direct Partners</h3>
        {isLoading ? (
          <span className={styles.skeletonVal} />
        ) : (
          <p>{approvedCount}</p>
        )}
      </div>
    </div>
  );
}
