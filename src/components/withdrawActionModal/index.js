"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './withdrawActionModal.module.scss';
import Button from '../button';
import Input from '../input';
import CloseIcon from '@/svg/closeIcon';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
const Close = '/assets/icons/close.svg';

export default function WithdrawActionModal({ actionType, amount, onClose, onConfirm, isSubmitting }) {
    const [remarks, setRemarks] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (receiptPreview) {
                URL.revokeObjectURL(receiptPreview);
            }
        };
    }, [receiptPreview]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReceipt(file);
            if (file.type.startsWith('image/')) {
                setReceiptPreview(URL.createObjectURL(file));
            } else {
                setReceiptPreview(null);
            }
        }
    };

    const handleConfirm = () => {
        if (!receipt) {
            toast.error('Transaction receipt is required');
            return;
        }
        
        onConfirm({ remarks, receipt });
    };

    return (
        <div className={styles.withdrawActionModal} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalheader}>
                    <div>
                        <h2>
                            {actionType === 'approve' ? 'Approve Request?' : 'Reject Request?'}
                        </h2>
                        <p>
                            Amount: ${amount}
                        </p>
                    </div>
                    <div className={styles.rightAlignment} onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.boxbody}>
                    <div style={{ marginBottom: '20px' }}>
                        <Input 
                            label="Remarks (Optional)" 
                            placeholder="Enter remarks..." 
                            value={remarks} 
                            onChange={(e) => setRemarks(e.target.value)} 
                            disabled={isSubmitting}
                            spacingRemove
                        />
                    </div>
                    <div className={styles.uplodBox}>
                        <label>
                            Transaction Receipt *
                        </label>
                        <div 
                            className={styles.upload} 
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input 
                                type="file" 
                                hidden 
                                ref={fileInputRef} 
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg, application/pdf"
                                disabled={isSubmitting}
                            />
                            <div>
                                {receipt ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        {receiptPreview && (
                                            <img src={receiptPreview} alt="Receipt Preview" style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                        )}
                                        <p style={{ color: '#059669', fontWeight: '600', textAlign: 'center' }}>{receipt.name}</p>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center' }}>Click to browse PNG, JPG or PDF</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonGrid}>
                        <Button 
                            icon={RightIcon}
                            text={actionType === 'approve' ? 'Approve' : 'Reject'} 
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                        />
                        <Button 
                            icon={Close}
                            text="Cancel" 
                            primaryOutline 
                            onClick={onClose}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
