import React from 'react'
import styles from './dashboardDetails.module.scss';
import DolorIcon from '@/svg/dolorIcon';
export default function DashboardDetails() {
    return (
        <div className={styles.dashboardDetails}>
            <div className={styles.items}>
                <p>
                    Portfolio Growth
                </p>
            </div>
            <div className={styles.items}>
                <div className={styles.twoCol}>
                    {
                        [...Array(2)].map(() => {
                            return (
                                <div className={styles.card}>
                                    <div className={styles.icon}>
                                        <DolorIcon />
                                    </div>
                                    <h3>
                                        Total Deposits
                                    </h3>
                                    <p>
                                        $12,894
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.bottomSection}>
                    <div className={styles.sharingModelCard}>
                        <h3>Current Sharing Model</h3>
                        <div className={styles.chartContainer}>
                            <svg viewBox="0 0 200 200" className={styles.pieChart}>
                                <defs>
                                    <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
                                        <rect width="8" height="8" fill="#FFFFFF" />
                                        <path d="M0,4 h8" stroke="#C0C0C0" strokeWidth="1.5" />
                                    </pattern>
                                </defs>
                                <circle cx="100" cy="100" r="100" fill="#EAEAEA" />
                                <path d="M 100 100 L 100 0 A 100 100 0 0 0 100 200 Z" fill="var(--Blue, #1C61BA)" />
                                <path d="M 100 100 L 100 200 A 100 100 0 0 0 200 100 Z" fill="url(#stripes)" />
                                
                                <line x1="100" y1="100" x2="100" y2="0" stroke="#fff" strokeWidth="2.5" />
                                <line x1="100" y1="100" x2="100" y2="200" stroke="#fff" strokeWidth="2.5" />
                                <line x1="100" y1="100" x2="200" y2="100" stroke="#fff" strokeWidth="2.5" />
                                
                                <text x="50" y="95" fill="#fff" textAnchor="middle" fontSize="15" fontWeight="500">Investor</text>
                                <text x="50" y="125" fill="#fff" textAnchor="middle" fontSize="28" fontWeight="700">50%</text>
                            </svg>
                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <span className={styles.blueSquare}></span> Investor
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.graySquare}></span> IB
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.blueSquare}></span> Company
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.transactionsCard}>
                        <h3>Recent Transactions</h3>
                        <div className={styles.transactionList}>
                            {[...Array(3)].map((_, i) => (
                                <div className={styles.transactionItem} key={i}>
                                    <div className={styles.row}>
                                        <h4>Rajat Sharma</h4>
                                        <h4>$12,478</h4>
                                    </div>
                                    <div className={styles.row}>
                                        <span>#987456</span>
                                        <span>Deposit</span>
                                    </div>
                                    <div className={`${styles.row} ${styles.timeRow}`}>
                                        <span className={styles.time}>4 Minutes Ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
