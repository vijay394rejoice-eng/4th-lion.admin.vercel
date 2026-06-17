import React from 'react'
import styles from './withdrawRequestsCard.module.scss';
import DolorIcon from '@/svg/dolorIcon';
export default function WithdrawRequestsCard() {
    return (
        <div className={styles.withdrawRequestsCard}>
            {
                [...Array(2)].map(() => {
                    return (
                        <div className={styles.items}>
                            <div className={styles.icon}>
                                <DolorIcon />
                            </div>
                            <h3>
                                Pending Withdraw Requests
                            </h3>
                            <p>
                                25
                            </p>
                        </div>
                    )
                })
            }
        </div>
    )
}
