'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import styles from './notifications.module.scss';
import Input from '@/components/input';
import Textarea from '@/components/textarea';
import Button from '@/components/button';
import GalleryView from '@/svg/galleryView';
import { sendAdminNotification } from '@/services/notifications';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

const TARGET_ROLES = ['USER', 'PARTNER', 'SUB_ADMIN'];

export default function Notifications() {
    // Send Notification Form States
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationContent, setNotificationContent] = useState('');
    const [notificationRoles, setNotificationRoles] = useState([]);
    const [isSendingNotification, setIsSendingNotification] = useState(false);

    // Send Popup Form States
    const [popupUrl, setPopupUrl] = useState('');
    const [popupImage, setPopupImage] = useState(null);
    const [popupImagePreview, setPopupImagePreview] = useState(null);
    const [popupRoles, setPopupRoles] = useState([]);
    const [isSendingPopup, setIsSendingPopup] = useState(false);

    const fileInputRef = useRef(null);

    // Revoke object URL on unmount or image change to prevent memory leaks
    useEffect(() => {
        if (!popupImage) {
            setPopupImagePreview(null);
            return;
        }
        const previewUrl = URL.createObjectURL(popupImage);
        setPopupImagePreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [popupImage]);

    // Role Toggles
    const handleNotificationRoleToggle = (role) => {
        setNotificationRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handlePopupRoleToggle = (role) => {
        setPopupRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    // File Handlers
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: is image?
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file (PNG, JPG, etc.)");
            return;
        }

        // Validation: size up to 3MB
        if (file.size > 3 * 1024 * 1024) {
            toast.error("Image size must be up to 3 MB");
            return;
        }

        setPopupImage(file);
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPopupImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Submit Handlers
    const handleSendNotification = async () => {
        if (notificationRoles.length === 0) {
            toast.error("Please select at least one Target Role");
            return;
        }
        if (!notificationTitle.trim()) {
            toast.error("Notification Title is required");
            return;
        }
        if (!notificationContent.trim()) {
            toast.error("Content is required");
            return;
        }

        setIsSendingNotification(true);
        try {
            const formData = new FormData();
            notificationRoles.forEach(role => {
                formData.append('target_role', role);
            });
            formData.append('send_notification', 'true');
            formData.append('send_popup', 'false');
            formData.append('title', notificationTitle.trim());
            formData.append('content', notificationContent.trim());
            formData.append('url', '');
            
            const res = await sendAdminNotification(formData);
            if (res && res.status === 1) {
                toast.success(res.message || "Notification sent successfully!");
                handleCancelNotification();
            } else {
                toast.error(res.message || "Failed to send notification");
            }
        } catch (err) {
            console.error("Failed to send notification:", err);
            toast.error(err.message || "Something went wrong while sending notification");
        } finally {
            setIsSendingNotification(false);
        }
    };

    const handleSendPopup = async () => {
        if (popupRoles.length === 0) {
            toast.error("Please select at least one Target Role");
            return;
        }
        if (!popupImage) {
            toast.error("Please upload an image for the popup");
            return;
        }

        setIsSendingPopup(true);
        try {
            const formData = new FormData();
            popupRoles.forEach(role => {
                formData.append('target_role', role);
            });
            formData.append('send_notification', 'false');
            formData.append('send_popup', 'true');
            formData.append('title', '');
            formData.append('content', '');
            formData.append('url', popupUrl.trim());
            formData.append('image', popupImage);

            const res = await sendAdminNotification(formData);
            if (res && res.status === 1) {
                toast.success(res.message || "Popup sent successfully!");
                handleCancelPopup();
            } else {
                toast.error(res.message || "Failed to send popup");
            }
        } catch (err) {
            console.error("Failed to send popup:", err);
            toast.error(err.message || "Something went wrong while sending popup");
        } finally {
            setIsSendingPopup(false);
        }
    };

    // Cancel Handlers
    const handleCancelNotification = () => {
        setNotificationTitle('');
        setNotificationContent('');
        setNotificationRoles([]);
    };

    const handleCancelPopup = () => {
        setPopupUrl('');
        setPopupImage(null);
        setPopupRoles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Render checkbox group
    const renderRoleCheckboxes = (selectedRoles, handleRoleToggle) => {
        return (
            <div className={styles.rolesSection}>
                <label className={styles.sectionLabel}>Target Roles</label>
                <div className={styles.checkboxGroup}>
                    {TARGET_ROLES.map((role) => {
                        const isActive = selectedRoles.includes(role);
                        return (
                            <div
                                key={role}
                                className={`${styles.checkboxItem} ${isActive ? styles.active : ''}`}
                                onClick={() => handleRoleToggle(role)}
                            >
                                <div className={styles.customCheck}>
                                    {isActive && (
                                        <motion.svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </div>
                                <span className={styles.checkboxLabel}>
                                    {role === 'USER' ? 'User' : role === 'PARTNER' ? 'Partner' : 'Sub Admin'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.notifications}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.boxHeader}>
                        <h2>
                            Send Notification
                        </h2>
                    </div>
                    <div className={styles.boxBody}>
                        {renderRoleCheckboxes(notificationRoles, handleNotificationRoleToggle)}
                        <Input 
                            spacingRemove 
                            label='Notification Title' 
                            value={notificationTitle}
                            onChange={(e) => setNotificationTitle(e.target.value)}
                            disabled={isSendingNotification}
                        />
                        <Textarea 
                            label="Content" 
                            value={notificationContent}
                            onChange={(e) => setNotificationContent(e.target.value)}
                            disabled={isSendingNotification}
                        />
                        <div className={styles.buttonGrid}>
                            <Button 
                                text={isSendingNotification ? "Sending..." : "Send"} 
                                icon={RightIcon} 
                                onClick={handleSendNotification}
                                disabled={isSendingNotification}
                            />
                            <Button 
                                text="Cancel" 
                                icon={CloseIcon} 
                                primaryOutline 
                                onClick={handleCancelNotification}
                                disabled={isSendingNotification}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.boxHeader}>
                        <h2>
                            Send Popup
                        </h2>
                    </div>
                    <div className={styles.boxBody}>
                        {renderRoleCheckboxes(popupRoles, handlePopupRoleToggle)}
                        <div className={styles.uplodBox}>
                            <label>
                                Upload Image
                            </label>
                            <div 
                                className={styles.upload} 
                                onClick={handleUploadClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={fileInputRef} 
                                    onChange={handleImageChange} 
                                    style={{ display: 'none' }}
                                    disabled={isSendingPopup}
                                />
                                {popupImagePreview ? (
                                    <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
                                        <img src={popupImagePreview} alt="Preview" className={styles.imagePreview} />
                                        <div className={styles.previewOverlay}>
                                            <p className={styles.fileName}>{popupImage?.name}</p>
                                            <button 
                                                type="button" 
                                                onClick={handleRemoveImage} 
                                                className={styles.removeBtn}
                                                disabled={isSendingPopup}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className={styles.iconCenter}>
                                            <GalleryView />
                                        </div>
                                        <p>
                                            Minimum 1280X720 px
                                        </p>
                                        <p>PNG or JPG. Upto 3 MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Input 
                            spacingRemove 
                            label='URL' 
                            value={popupUrl}
                            onChange={(e) => setPopupUrl(e.target.value)}
                            disabled={isSendingPopup}
                        />
                        <div className={styles.buttonGrid}>
                            <Button 
                                text={isSendingPopup ? "Sending..." : "Send"} 
                                icon={RightIcon} 
                                onClick={handleSendPopup}
                                disabled={isSendingPopup}
                            />
                            <Button 
                                text="Cancel" 
                                icon={CloseIcon} 
                                primaryOutline 
                                onClick={handleCancelPopup}
                                disabled={isSendingPopup}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
