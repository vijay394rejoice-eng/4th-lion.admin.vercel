import React, { useState, useEffect } from 'react'
import styles from './minimumWithdraw.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
import { getMinWithdrawAmount, updateMinWithdrawAmount } from '@/services/settings';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function MinimumWithdraw() {
    const [amount, setAmount] = useState('');
    const [initialAmount, setInitialAmount] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMinWithdrawAmount = async () => {
        setIsLoading(true);
        try {
            const res = await getMinWithdrawAmount();
            if (res && res.status === 1) {
                const amt = res.data?.amount ?? '';
                setAmount(amt);
                setInitialAmount(amt);
            }
        } catch (err) {
            console.error("Failed to load minimum withdraw amount:", err);
            toast.error(err?.message || "Failed to load minimum withdraw amount");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMinWithdrawAmount();
    }, []);

    const handleSave = async () => {
        if (amount === '') {
            toast.error("Please enter a minimum withdraw amount");
            return;
        }
        
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            toast.error("Please enter a valid positive number");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await updateMinWithdrawAmount({ amount: numericAmount });
            if (res && res.status === 1) {
                toast.success(res.message || "Minimum withdraw amount updated successfully");
                setInitialAmount(numericAmount);
            } else {
                toast.error(res?.message || "Failed to update minimum withdraw amount");
            }
        } catch (err) {
            console.error("Failed to update minimum withdraw amount:", err);
            toast.error(err?.message || "Something went wrong while saving");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setAmount(initialAmount);
    };

    return (
        <div className={styles.minimumWithdraw}>
            <Input 
                label='Set Minimum Withdrawal Amount' 
                placeholder="$5" 
                spacingRemove 
                type="number"
                min="0"
                value={amount}
                onChange={(e) => {
                    const val = e.target.value;
                    // Prevent entering negative values
                    if (val === '' || Number(val) >= 0) {
                        setAmount(val);
                    }
                }}
                disabled={isLoading || isSubmitting}
            />
            <div className={styles.buttonGrid}>
                <Button 
                    text={isSubmitting ? "Saving..." : "Save"} 
                    icon={RightIcon} 
                    onClick={handleSave}
                    disabled={isLoading || isSubmitting}
                />
                <Button 
                    text="Cancel" 
                    icon={CloseIcon} 
                    primaryOutline 
                    onClick={handleCancel}
                    disabled={isLoading || isSubmitting}
                />
            </div>
        </div>
    )
}
