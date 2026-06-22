import React from 'react'
import styles from './dashboardCardList.module.scss';
import DolorIcon from '@/svg/dolorIcon';
export default function DashboardCardList() {
    return (
        <div className={styles.dashboardCardList}>
            {
                [...Array(8)].map(() => {
                    return (
                        <div className={styles.items}>
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
    )
}
