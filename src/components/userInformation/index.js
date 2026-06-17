import React from 'react'
import styles from './userInformation.module.scss';
import DangerIcon from '@/svg/dangerIcon';
import CloseIcon from '@/svg/closeIcon';
import Button from '../button';
export default function UserInformation() {
    return (
        <div className={styles.userInformation}>
            <div className={styles.modal}>
                <div className={styles.modalheader}>
                    <div>
                        <h2>
                            Mark Twain
                        </h2>
                        <p>
                            mail@mail.com
                        </p>
                    </div>
                    <div className={styles.rightAlignment}>
                        <DangerIcon />
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.textgrid}>
                        <div>
                            <p>Date Joined</p>
                            <span>24-12-2026 | 10:12 PM</span>
                        </div>
                        <div>
                            <p>IB Status</p>
                            <span>Approved</span>
                        </div>
                        <div>
                            <p>Total Deposit</p>
                            <span>$12,845</span>
                        </div>
                        <div>
                            <p>Profit</p>
                            <span>$12,845</span>
                        </div>
                    </div>
                    <div className={styles.buttonGrid}>
                        <Button text="Upload Excel" />
                        <Button text="Manual Entry" primaryOutline />
                    </div>
                </div>
            </div>
        </div>
    )
}
