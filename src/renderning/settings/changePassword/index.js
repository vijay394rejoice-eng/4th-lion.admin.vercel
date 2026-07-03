"use client";
import React, { useState } from 'react'
import styles from './changePassword.module.scss';
import Button from '@/components/button';
import Input from '@/components/input';
import { changePassword } from '@/services/auth';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';
const LockIcon = '/assets/icons/lock.svg';
const EyeIcon = '/assets/icons/eye.svg';

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.current_password) {
            newErrors.current_password = 'Current password is required';
        }
        if (!formData.new_password) {
            newErrors.new_password = 'New password is required';
        }
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Confirm password is required';
        } else if (formData.new_password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        try {
            const res = await changePassword(formData);
            if (res && res.status === 1) {
                toast.success(res.message || 'Password changed successfully');
                setFormData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            } else {
                toast.error(res?.message || 'Failed to change password');
            }
        } catch (err) {
            console.error('Failed to change password:', err);
            // toast.error(err?.message || 'Something went wrong while changing password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className={styles.changePassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                <div>
                    <Input 
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        type={showPassword.current ? 'text' : 'password'} 
                        rightIcon={EyeIcon} 
                        leftIcon={LockIcon} 
                        label='Current Password' 
                        placeholder='• • • • • • • • • • ' 
                        onRightIconClick={() => toggleShowPassword('current')}
                        disabled={isLoading}
                    />
                    {errors.current_password && (
                        <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {errors.current_password}
                        </span>
                    )}
                </div>

                <div>
                    <Input 
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        type={showPassword.new ? 'text' : 'password'} 
                        rightIcon={EyeIcon} 
                        leftIcon={LockIcon} 
                        label='New Password' 
                        placeholder='• • • • • • • • • • ' 
                        onRightIconClick={() => toggleShowPassword('new')}
                        disabled={isLoading}
                    />
                    {errors.new_password && (
                        <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {errors.new_password}
                        </span>
                    )}
                </div>

                <div>
                    <Input 
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        type={showPassword.confirm ? 'text' : 'password'} 
                        rightIcon={EyeIcon} 
                        leftIcon={LockIcon} 
                        label='Confirm Password' 
                        placeholder='• • • • • • • • • • ' 
                        onRightIconClick={() => toggleShowPassword('confirm')}
                        disabled={isLoading}
                    />
                    {errors.confirm_password && (
                        <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {errors.confirm_password}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.buttonGrid}>
                <Button 
                    type="submit"
                    text={isLoading ? "Saving..." : "Save"} 
                    icon={RightIcon} 
                    disabled={isLoading}
                />
                <Button 
                    type="button"
                    text="Cancel" 
                    icon={CloseIcon} 
                    primaryOutline 
                    onClick={handleCancel}
                    disabled={isLoading}
                />
            </div>
        </form>
    )
}
