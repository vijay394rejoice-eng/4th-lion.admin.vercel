"use client";
import React, { useState } from 'react';
import styles from './kycPreview.module.scss';
import Button from '../button';
import Input from '../input';

const ProofImage = '/assets/images/proof.png';
const RightIcon = 'assets/icons/right.svg';
const Close = 'assets/icons/close.svg';

export default function KycPreview({ request, onClose, onApprove, onReject, isSubmitting }) {
    const [remarks, setRemarks] = useState('');

    if (!request) return null;

    // Helper to extract image URL for category & side
    const getDocUrl = (category, side) => {
        const doc = request.documents?.find(
            d => d.document_category === category && d.document_side === side
        );
        return doc ? doc.file_url : ProofImage;
    };

    const displayName = request.first_name || request.last_name 
        ? `${request.first_name || ''} ${request.last_name || ''}`.trim()
        : `User: ${request.user_id?.substring(0, 8)}...`;
    
    const displayEmail = request.email || `Role: ${request.role}`;

    const handleApproveClick = () => {
        if (onApprove) {
            onApprove(request.id, remarks);
        }
    };

    const handleRejectClick = () => {
        if (onReject) {
            onReject(request.id, remarks);
        }
    };

    return (
        <div className={styles.kycPreview} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalheader}>
                    <h2>
                        {displayName}
                    </h2>
                    <p>
                        {displayEmail}
                    </p>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.twoCol}>
                        <div>
                            <p>
                                ID Proof (Front)
                            </p>
                            <a href={getDocUrl('IDENTITY_PROOF', 'FRONT')} target="_blank" rel="noopener noreferrer">
                                <img src={getDocUrl('IDENTITY_PROOF', 'FRONT')} alt='ID Proof Front' />
                            </a>
                        </div>
                        <div>
                            <p>
                                ID Proof (Back)
                            </p>
                            <a href={getDocUrl('IDENTITY_PROOF', 'BACK')} target="_blank" rel="noopener noreferrer">
                                <img src={getDocUrl('IDENTITY_PROOF', 'BACK')} alt='ID Proof Back' />
                            </a>
                        </div>
                    </div>
                    <div className={styles.twoCol}>
                        <div>
                            <p>
                                Address Proof (Front)
                            </p>
                            <a href={getDocUrl('ADDRESS_PROOF', 'FRONT')} target="_blank" rel="noopener noreferrer">
                                <img src={getDocUrl('ADDRESS_PROOF', 'FRONT')} alt='Address Proof Front' />
                            </a>
                        </div>
                        <div>
                            <p>
                                Address Proof (Back)
                            </p>
                            <a href={getDocUrl('ADDRESS_PROOF', 'BACK')} target="_blank" rel="noopener noreferrer">
                                <img src={getDocUrl('ADDRESS_PROOF', 'BACK')} alt='Address Proof Back' />
                            </a>
                        </div>
                    </div>
                    
                    {request.status === "PENDING" ? (
                        <div style={{ marginBottom: '24px' }}>
                            <Input 
                                label="Remarks"
                                placeholder="Enter approval/rejection remarks..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    ) : (
                        request.remarks && (
                            <div style={{ marginBottom: '24px' }}>
                                <Input 
                                    label="Remarks"
                                    value={request.remarks}
                                    disabled
                                />
                            </div>
                        )
                    )}

                    <div className={styles.buttonGrid}>
                        {request.status === "PENDING" ? (
                            <>
                                <Button 
                                    icon={RightIcon} 
                                    text={isSubmitting ? "Approving..." : "Approve KYC"} 
                                    onClick={handleApproveClick}
                                    disabled={isSubmitting}
                                />
                                <Button 
                                    icon={Close} 
                                    text={isSubmitting ? "Rejecting..." : "Reject KYC"} 
                                    primaryOutline 
                                    onClick={handleRejectClick}
                                    disabled={isSubmitting}
                                />
                            </>
                        ) : (
                            <div className={styles.singleButton}>
                                <Button 
                                    text="Close" 
                                    onClick={onClose}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
