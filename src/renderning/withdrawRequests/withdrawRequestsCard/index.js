"use client";
import React, { useState, useEffect } from 'react';
import styles from './withdrawRequestsCard.module.scss';
import DolorIcon from '@/svg/dolorIcon';
import { getWithdrawRequests } from '@/services/withdraw';

export default function WithdrawRequestsCard({ pendingCount, approvedCount }) {
    const [localPending, setLocalPending] = useState(0);
    const [localApproved, setLocalApproved] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const hasProps = pendingCount !== undefined && approvedCount !== undefined;

    useEffect(() => {
        if (hasProps) {
            setIsLoading(false);
            return;
        }

        const fetchCounts = async () => {
            try {
                const res = await getWithdrawRequests({ page: 1, limit: 1 });
                if (res && res.status === 1) {
                    setLocalPending(res.data?.pending_count || 0);
                    setLocalApproved(res.data?.approved_count || 0);
                }
            } catch (err) {
                console.error("Failed to fetch withdraw counts for card:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCounts();
    }, [hasProps]);

    const displayPending = hasProps ? pendingCount : localPending;
    const displayApproved = hasProps ? approvedCount : localApproved;

    return (
        <div className={styles.withdrawRequestsCard}>
            <div className={styles.items}>
                <div className={styles.icon}>
                    <DolorIcon />
                </div>
                <h3>
                    Pending Withdraw Requests
                </h3>
                <p>
                    {isLoading ? "..." : displayPending}
                </p>
            </div>
            <div className={styles.items}>
                <div className={styles.icon}>
                    <DolorIcon />
                </div>
                <h3>
                    Approved Withdraw Requests
                </h3>
                <p>
                    {isLoading ? "..." : displayApproved}
                </p>
            </div>
        </div>
    )
}
