'use client';
import React, { useState, useEffect } from 'react';
import styles from './addNewSubAdmin.module.scss';
import Button from '../button';
import Input from '../input';
import { createSubAdmin, updateSubAdmin, deleteSubAdmin, getSubAdminPermissions } from '@/services/subAdmin';
import toast from 'react-hot-toast';
import LogoutModal from '../logoutModal';

const RightIcon = 'assets/icons/right.svg';
const Close = 'assets/icons/close.svg';
const EmailIcon = 'assets/icons/email.svg';
const LockIcon = 'assets/icons/lock.svg';
const EyeIcon = 'assets/icons/eye.svg';

export default function AddNewSubAdmin({ onClose, onSuccess, subAdmin = null }) {
    const isEditMode = subAdmin !== null;

    const [firstName, setFirstName] = useState(subAdmin?.first_name || '');
    const [lastName, setLastName] = useState(subAdmin?.last_name || '');
    const [email, setEmail] = useState(subAdmin?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(isEditMode ? subAdmin.is_active : true);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [errors, setErrors] = useState({});

    const isLoading = isSubmitting || isDeleting;

    // Permissions states
    const [selectedAccess, setSelectedAccess] = useState(subAdmin?.permissions || []);
    const [permissionsList, setPermissionsList] = useState([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await getSubAdminPermissions();
                if (res && res.status === 1) {
                    setPermissionsList(res.data || []);
                }
            } catch (err) {
                console.error("Failed to load permissions:", err);
                // toast.error("Failed to load permissions list");
            } finally {
                setIsLoadingPermissions(false);
            }
        };
        fetchPermissions();
    }, []);

    const handleToggle = (value) => {
        if (selectedAccess.includes(value)) {
            setSelectedAccess(selectedAccess.filter(item => item !== value));
        } else {
            setSelectedAccess([...selectedAccess, value]);
        }
    };

    const validateForm = () => {
        let validationErrors = {};
        if (!firstName.trim()) {
            validationErrors.firstName = 'First name is required';
        }
        if (!lastName.trim()) {
            validationErrors.lastName = 'Last name is required';
        }
        if (!email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = 'Invalid email address';
        }

        // Passwords validation
        if (isEditMode) {
            // Password optional in edit mode, but if entered must match validation rules
            if (password) {
                if (password.length < 6) {
                    validationErrors.password = 'Password must be at least 6 characters';
                }
                if (!confirmPassword) {
                    validationErrors.confirmPassword = 'Confirm password is required';
                } else if (password !== confirmPassword) {
                    validationErrors.confirmPassword = 'Passwords do not match';
                }
            }
        } else {
            // Password required in add mode
            if (!password) {
                validationErrors.password = 'Password is required';
            } else if (password.length < 6) {
                validationErrors.password = 'Password must be at least 6 characters';
            }
            if (!confirmPassword) {
                validationErrors.confirmPassword = 'Confirm password is required';
            } else if (password !== confirmPassword) {
                validationErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading || !validateForm()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                permissions: selectedAccess,
            };
            
            if (isEditMode) {
                payload.is_active = isActive;
                if (password) {
                    payload.password = password;
                }
                const res = await updateSubAdmin(subAdmin.id, payload);
                if (res && res.status === 1) {
                    toast.success(res.message || 'Sub-admin updated successfully');
                    if (onSuccess) onSuccess();
                    if (onClose) onClose();
                } else {
                    toast.error(res?.message || 'Failed to update sub-admin');
                }
            } else {
                payload.password = password;
                payload.confirm_password = confirmPassword;
                const res = await createSubAdmin(payload);
                if (res && res.status === 1) {
                    toast.success(res.message || 'Sub-admin created successfully');
                    if (onSuccess) onSuccess();
                    if (onClose) onClose();
                } else {
                    toast.error(res?.message || 'Failed to create sub-admin');
                }
            }
        } catch (err) {
            console.error('Failed to save sub-admin:', err);
            // toast.error(err?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteSubAdmin(subAdmin.id);
            if (res && res.status === 1) {
                toast.success(res.message || 'Sub-admin deleted successfully');
                setShowDeleteConfirm(false);
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                toast.error(res?.message || 'Failed to delete sub-admin');
            }
        } catch (err) {
            console.error('Failed to delete sub-admin:', err);
            // toast.error(err?.message || 'Something went wrong');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className={styles.addNewSubAdmin} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalheader}>
                    <h2>
                        {isEditMode ? 'Update Sub-Admin' : 'Add New Sub-Admin'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.twoCol}>
                        <div>
                            <Input 
                                spacingRemove
                                label='First Name' 
                                placeholder='John' 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                disabled={isLoading}
                            />
                            {errors.firstName && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>}
                        </div>

                        <div>
                            <Input 
                                spacingRemove
                                label='Last Name' 
                                placeholder='Doe' 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                disabled={isLoading}
                            />
                            {errors.lastName && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>}
                        </div>
                    </div>

                    <div>
                        <Input 
                            leftIcon={EmailIcon} 
                            label='Email' 
                            placeholder='hijuyed@gmail.com' 
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.email && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                    </div>

                    <div className={styles.twoCol}>
                        <div>
                            <Input 
                                leftIcon={LockIcon} 
                                rightIcon={EyeIcon} 
                                label={isEditMode ? 'New Password (Optional)' : 'Password'}
                                placeholder='• • • • • • • • • • ' 
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onRightIconClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            />
                            {errors.password && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
                        </div>

                        <div>
                            <Input 
                                leftIcon={LockIcon} 
                                rightIcon={EyeIcon} 
                                label={isEditMode ? 'Confirm New Password' : 'Confirm Password'}
                                placeholder='• • • • • • • • • • ' 
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className={styles.allCheckboxtext}>
                        <p>
                            Access
                        </p>
                        <div className={styles.checkboxList}>
                            {isLoadingPermissions ? (
                                <p style={{ fontSize: '14px', color: '#64748B' }}>Loading permissions...</p>
                            ) : permissionsList.length > 0 ? (
                                permissionsList.map((option) => {
                                    const isChecked = selectedAccess.includes(option.value);
                                    return (
                                        <label key={option.value} className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggle(option.value)}
                                                className={styles.hiddenCheckbox}
                                                disabled={isLoading}
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
                                })
                            ) : (
                                <p style={{ fontSize: '14px', color: '#EF4444' }}>No permissions found</p>
                            )}
                        </div>
                    </div>

                    {isEditMode && (
                        <div className={styles.allCheckboxtext} style={{ marginTop: '4px' }}>
                            <p>
                                Status
                            </p>
                            <div className={styles.checkboxList}>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => setIsActive(!isActive)}
                                        className={styles.hiddenCheckbox}
                                        disabled={isLoading}
                                    />
                                    <div className={`${styles.customCheckbox} ${isActive ? styles.checked : ''}`}>
                                        {isActive && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={styles.checkboxLabel}>Sub-Admin is Active</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonGrid}>
                        <Button 
                            type="submit"
                            icon={RightIcon} 
                            text={isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Sub-Admin' : 'Add Sub-Admin')} 
                            disabled={isLoading}
                        />
                        {isEditMode && (
                            <Button 
                                icon={Close} 
                                text={isDeleting ? 'Deleting...' : 'Delete This Sub-Admin'} 
                                danger
                                onClick={handleDeleteClick}
                                disabled={isLoading}
                                type="button"
                             />
                        )}
                        <Button 
                            icon={Close} 
                            text="Cancel" 
                            primaryOutline 
                            onClick={onClose}
                            disabled={isLoading}
                            type="button"
                        />
                    </div>
                </form>
            </div>
            {showDeleteConfirm && (
                <LogoutModal 
                    message="Are you sure you want to delete this sub-admin?"
                    confirmText="Delete"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                    isSubmitting={isDeleting}
                />
            )}
        </div>
    )
}
