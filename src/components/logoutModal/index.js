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
    isSubmitting = false,
    danger = true
}) {
    const getLoadingText = () => {
        if (!confirmText) return "Processing...";
        if (confirmText.toLowerCase().endsWith('e')) {
            return `${confirmText.slice(0, -1)}ing...`;
        }
        return `${confirmText}ing...`;
    };

    return (
        <div className={styles.logoutModal} onClick={(e) => { e.stopPropagation(); onCancel(); }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p>
                    {message}
                </p>
                <div className={styles.buttonGrid}>
                    <Button 
                        danger={danger} 
                        text={isSubmitting ? getLoadingText() : confirmText} 
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

