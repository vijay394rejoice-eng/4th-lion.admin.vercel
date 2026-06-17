import React from 'react'
import styles from './logoutModal.module.scss';
import Button from '../button';

const BlockIcon = '/assets/icons/block.svg';
const CancelIcon = '/assets/icons/close.svg';

export default function LogoutModal({ 
    message = "Are you sure you want to block this user?", 
    confirmText = "Block", 
    confirmIcon = BlockIcon, 
    onConfirm, 
    onCancel,
    isSubmitting = false
}) {
    return (
        <div className={styles.logoutModal} onClick={(e) => { e.stopPropagation(); onCancel(); }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p>
                    {message}
                </p>
                <div className={styles.buttonGrid}>
                    <Button 
                        danger 
                        text={isSubmitting ? "Deleting..." : confirmText} 
                        icon={confirmIcon} 
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    />
                    <Button 
                        text="Cancel" 
                        primaryOutline 
                        icon={CancelIcon} 
                        onClick={onCancel}
                        disabled={isSubmitting}
                        type="button"
                    />
                </div>
            </div>
        </div>
    )
}

