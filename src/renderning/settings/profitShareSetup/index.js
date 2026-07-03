"use client";
import React, { useState, useEffect } from 'react';
import styles from './profitShareSetup.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
import { getSettlementConfig, updateSettlementConfig } from '@/services/settings';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function ProfitShareSetup() {
    const [userShare, setUserShare] = useState('');
    const [partnerShare, setPartnerShare] = useState('');
    const [adminShare, setAdminShare] = useState('');
    const [originalConfig, setOriginalConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const res = await getSettlementConfig();
            if (res && res.status === 1) {
                const data = res.data || {};
                const formatPercent = (val) => {
                    if (val === undefined || val === null) return '';
                    const num = Number(val);
                    return isNaN(num) ? val : parseFloat(num.toString());
                };
                
                setUserShare(formatPercent(data.user_share_percentage));
                setPartnerShare(formatPercent(data.partner_share_percentage));
                setAdminShare(formatPercent(data.admin_share_percentage));
                setOriginalConfig(data);
            } else {
                toast.error(res?.message || "Failed to load settlement configuration");
            }
        } catch (err) {
            console.error("Failed to load settlement config:", err);
            // toast.error(err?.message || "Something went wrong while loading configuration");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleCancel = () => {
        if (originalConfig) {
            const formatPercent = (val) => {
                if (val === undefined || val === null) return '';
                const num = Number(val);
                return isNaN(num) ? val : parseFloat(num.toString());
            };
            setUserShare(formatPercent(originalConfig.user_share_percentage));
            setPartnerShare(formatPercent(originalConfig.partner_share_percentage));
            setAdminShare(formatPercent(originalConfig.admin_share_percentage));
        }
        toast.success("Changes discarded");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        const userNum = Number(userShare);
        const partnerNum = Number(partnerShare);
        const adminNum = Number(adminShare);

        if (isNaN(userNum) || isNaN(partnerNum) || isNaN(adminNum)) {
            toast.error("Please enter valid numbers for percentages");
            return;
        }

        const total = userNum + partnerNum + adminNum;
        if (total !== 100) {
            toast.error(`Total percentage must equal 100% (currently ${total}%)`);
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                user_share_percentage: userNum,
                admin_share_percentage: adminNum,
                partner_share_percentage: partnerNum
            };
            const res = await updateSettlementConfig(payload);
            if (res && res.status === 1) {
                toast.success(res.message || "Settlement configuration updated successfully");
                fetchConfig();
            } else {
                toast.error(res?.message || "Failed to update settlement configuration");
            }
        } catch (err) {
            console.error("Failed to update settlement config:", err);
            // toast.error(err?.message || "Something went wrong while saving configuration");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.profitShareSetup}>
                <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontFamily: 'var(--font-manrope)' }}>
                    Loading configuration...
                </div>
            </div>
        );
    }

    return (
        <form className={styles.profitShareSetup} onSubmit={handleSave}>
            <Input 
                label='Investor Share (%)' 
                spacingRemove 
                placeholder='e.g. 50' 
                type="number"
                step="any"
                min="0"
                max="100"
                value={userShare}
                onChange={(e) => setUserShare(e.target.value)}
                required
            />
            <Input 
                label='Partner Share (%)' 
                spacingRemove 
                placeholder='e.g. 10' 
                type="number"
                step="any"
                min="0"
                max="100"
                value={partnerShare}
                onChange={(e) => setPartnerShare(e.target.value)}
                required
            />
            <Input 
                label='Company Share (%)' 
                spacingRemove 
                placeholder='e.g. 40' 
                type="number"
                step="any"
                min="0"
                max="100"
                value={adminShare}
                onChange={(e) => setAdminShare(e.target.value)}
                required
            />
            <div className={styles.buttonGrid}>
                <Button 
                    text={isSaving ? "Saving..." : "Save"} 
                    icon={RightIcon} 
                    type="submit"
                    disabled={isSaving}
                />
                <Button 
                    text="Cancel" 
                    icon={CloseIcon} 
                    primaryOutline 
                    onClick={handleCancel}
                    type="button"
                    disabled={isSaving}
                />
            </div>
        </form>
    );
}
