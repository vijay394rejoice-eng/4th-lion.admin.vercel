import React from 'react'
import styles from './profitSharingCard.module.scss';
import CopyIcon from '@/svg/copyIcon';
export default function ProfitSharingCard() {
    return (
        <div className={styles.profitSharingCard}>
            <div className={styles.items}>
                <h3>
                    Your Referral link
                </h3>
                <div className={styles.link}>
                    <p>
                        https://domain.com/123abc
                    </p>
                    <CopyIcon />
                </div>
            </div>
            <div className={styles.items}>
                <h3>
                    Total Clients
                </h3>
                <span>
                    12
                </span>
            </div>
            <div className={styles.items}>
                <h3>
                    Total Lots Traded
                </h3>
                <span>
                    2054
                </span>
            </div>
            <div className={styles.items}>
                <h3>
                    Commission
                </h3>
                <span>
                    $8,000
                </span>
            </div>
        </div>
    )
}
