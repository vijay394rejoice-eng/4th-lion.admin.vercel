'use client'
import React, { useState } from 'react'
import styles from './addNewSubAdmin.module.scss';
import Button from '../button';
import Input from '../input';
const RightIcon = 'assets/icons/right.svg';
const Close = 'assets/icons/close.svg';
const EmailIcon = 'assets/icons/email.svg';
const LockIcon = 'assets/icons/lock.svg';
const EyeIcon = 'assets/icons/eye.svg';

const ACCESS_OPTIONS = [
    { id: 'dashboard', label: 'Access Dashboard Overview' },
    { id: 'users', label: 'Manage Users' },
    { id: 'withdraw', label: 'Manage Withdraw Requests' },
    { id: 'ib', label: 'Manage IB Requests' },
    { id: 'notifications', label: 'Send Notifications' },
    { id: 'kyc', label: 'Manage KYC Requests' },
];

export default function AddNewSubAdmin() {
    const [selectedAccess, setSelectedAccess] = useState(['users']);

    const handleToggle = (id) => {
        if (selectedAccess.includes(id)) {
            setSelectedAccess(selectedAccess.filter(item => item !== id));
        } else {
            setSelectedAccess([...selectedAccess, id]);
        }
    };

    return (
        <div className={styles.addNewSubAdmin}>
            <div className={styles.modal}>
                <div className={styles.modalheader}>
                    <h2>
                        Add New Sub-Admin
                    </h2>
                </div>
                <div className={styles.modalBody}>
                    <Input leftIcon={EmailIcon} label='Email' placeholder='hijuyed@gmail.com' />
                    <Input leftIcon={LockIcon} rightIcon={EyeIcon} label='Password' placeholder='• • • • • • • • • • ' />
                    <div className={styles.allCheckboxtext}>
                        <p>
                            Access
                        </p>
                        <div className={styles.checkboxList}>
                            {ACCESS_OPTIONS.map((option) => {
                                const isChecked = selectedAccess.includes(option.id);
                                return (
                                    <label key={option.id} className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggle(option.id)}
                                            className={styles.hiddenCheckbox}
                                        />
                                        <div className={`${styles.customCheckbox} ${isChecked ? styles.checked : ''}`}>
                                            {isChecked && (
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={styles.checkboxLabel}>{option.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.buttonGrid}>
                        <Button icon={RightIcon} text="Approve KYC " />
                        <Button icon={Close} text="Reject KYC" primaryOutline />
                    </div>
                </div>
            </div>
        </div>
    )
}
