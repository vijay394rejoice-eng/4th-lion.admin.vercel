import React from 'react'
import styles from './logoutModal.module.scss';
import Button from '../button';
const BlockIcon = '/assets/icons/block.svg';
const CancelIcon = '/assets/icons/close.svg';
export default function LogoutModal() {
    return (
        <div className={styles.logoutModal}>
            <div className={styles.modal}>
                <p>
                    Are you sure you want to
                    block this user?
                </p>
                <div className={styles.buttonGrid}>
                    <Button danger text="Block" icon={BlockIcon} />
                    <Button text="Cancel" primaryOutline icon={CancelIcon} />
                </div>
            </div>
        </div>
    )
}
