import React from 'react'
import styles from './changePassword.module.scss';
import Button from '@/components/button';
import Input from '@/components/input';
const RightIcon = 'assets/icons/right.svg';
const CloseIcon = 'assets/icons/close.svg';
const LockIcon = 'assets/icons/lock.svg';
const EyeIcon = 'assets/icons/eye.svg';
export default function ChangePassword() {
    return (
        <div className={styles.changePassword}>
            <Input rightIcon={EyeIcon} leftIcon={LockIcon} label='Current Password' placeholder='• • • • • • • • • • ' />
            <Input rightIcon={EyeIcon} leftIcon={LockIcon} label='New Password' placeholder='• • • • • • • • • • ' />
            <Input rightIcon={EyeIcon} leftIcon={LockIcon} label='Confirm Password' placeholder='• • • • • • • • • • ' />
            <div className={styles.buttonGrid}>
                <Button text="Send" icon={RightIcon} />
                <Button text="Cancel" icon={CloseIcon} primaryOutline />
            </div>
        </div>
    )
}
