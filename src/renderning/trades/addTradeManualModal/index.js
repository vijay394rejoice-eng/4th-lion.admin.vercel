"use client";
import React, { useState } from 'react';
import styles from './addTradeManualModal.module.scss';
import CloseIcon from '@/svg/closeIcon';
import Button from '@/components/button';
import Input from '@/components/input';
import DateTimeInput from '@/components/dateTimeInput';
import { createTradeManual } from '@/services/trades';
import toast from 'react-hot-toast';
import LogoutModal from '@/components/logoutModal';
import { validateTradeData } from '@/utils/tradeValidation';

const RightIcon = '/assets/icons/right.svg';
const Close = '/assets/icons/close.svg';
const SubmitIcon = '/assets/icons/right.svg'; // Reuse right icon for add

const defaultForm = {
    entry_time: '',
    position: '#',
    symbol: '',
    type: 'buy',
    volume: '',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    exit_time: '',
    exit_price: '',
    commission: '0',
    swap: '0',
    profit: '',
    profit_percent: ''
};

export default function AddTradeManualModal({ onClose, onSuccess }) {
    const [draftTrades, setDraftTrades] = useState([]);
    const [formData, setFormData] = useState({ ...defaultForm });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Immediate validation
        const tempForm = { ...formData, [name]: value };
        const { errors: newErrors } = validateTradeData(tempForm, [name]);
        
        setErrors(prev => ({
            ...prev,
            [name]: newErrors[name] || ''
        }));
    };

    const validate = () => {
        const required = ['entry_time', 'position', 'symbol', 'volume', 'entry_price', 'exit_time', 'exit_price', 'profit'];
        const { errors: newErrors, trimmedData } = validateTradeData(formData, required);
        
        // Update form data to trimmed version
        setFormData(trimmedData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 ? trimmedData : false;
    };

    const parseTrade = (form) => {
        return {
            entry_time: form.entry_time,
            position: form.position ? form.position.toString() : null,
            symbol: form.symbol,
            type: form.type || null,
            volume: form.volume ? parseFloat(form.volume) : null,
            entry_price: form.entry_price ? parseFloat(form.entry_price) : null,
            stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
            take_profit: form.take_profit ? parseFloat(form.take_profit) : null,
            exit_time: form.exit_time,
            exit_price: form.exit_price ? parseFloat(form.exit_price) : null,
            commission: form.commission ? parseFloat(form.commission) : 0,
            swap: form.swap ? parseFloat(form.swap) : 0,
            profit: form.profit ? parseFloat(form.profit) : null,
            profit_percent: form.profit_percent ? parseFloat(form.profit_percent) : null,
            _localId: Math.random().toString(36).substring(2, 9)
        };
    };

    const handleAddDraft = () => {
        const validatedData = validate();
        if (!validatedData) {
            toast.error("Please fix the validation errors");
            return;
        }
        const newTrade = parseTrade(validatedData);
        setDraftTrades(prev => [...prev, newTrade]);
        // Reset form
        setFormData({ ...defaultForm });
        setErrors({});
        toast.success("Trade added to list!");
    };

    const handleRemoveDraft = (localId) => {
        setDraftTrades(prev => prev.filter(t => t._localId !== localId));
        toast.success("Trade removed from list");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let finalPayload = [...draftTrades];
        
        // Determine if the form currently has values filled out
        const hasFormValues = Object.entries(formData).some(([key, val]) => {
            if (key === 'commission' || key === 'swap') return val !== '0' && val !== '';
            if (key === 'type') return false; // ignore type default buy
            return val !== '';
        });

        if (hasFormValues || finalPayload.length === 0) {
            const validatedData = validate();
            if (!validatedData) {
                toast.error("Please complete the current trade form or clear it before saving");
                return;
            }
            const currentTrade = parseTrade(validatedData);
            finalPayload.push(currentTrade);
        }

        // Clean local identifiers
        const cleanedPayload = finalPayload.map(({ _localId, ...trade }) => trade);

        setIsLoading(true);
        try {
            const res = await createTradeManual(cleanedPayload);
            if (res && res.status === 1) {
                toast.success(res.message || `Successfully saved ${cleanedPayload.length} trade(s)!`);
                if (onSuccess) onSuccess();
                onClose();
            } else {
                toast.error(res?.message || "Failed to save manual trades");
            }
        } catch (err) {
            console.error("Failed to save trades:", err);
            // toast.error is handled by api.js globally on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttemptClose = () => {
        const hasFormValues = Object.entries(formData).some(([key, val]) => {
            if (key === 'commission' || key === 'swap') return val !== '0' && val !== '';
            if (key === 'type') return false;
            return val !== '';
        });

        if (hasFormValues || draftTrades.length > 0) {
            setShowCancelConfirm(true);
        } else {
            onClose();
        }
    };

    return (
        <div className={styles.addTradeManualModal}>
            <div className={styles.modal}>
                <div className={styles.modalheader}>
                    <div>
                        <h2>Add Trade Details (Multiple)</h2>
                    </div>
                    <div className={styles.rightAlignment} onClick={handleAttemptClose}>
                        <CloseIcon />
                    </div>
                </div>
                
                <div className={styles.modalBody}>
                    {/* Draft List Summary */}
                    {draftTrades.length > 0 && (
                        <div className={styles.draftList}>
                            <h3>Draft List ({draftTrades.length} Trades added)</h3>
                            <div className={styles.draftItems}>
                                {draftTrades.map((trade, idx) => (
                                    <div key={trade._localId} className={styles.draftItem}>
                                        <div className={styles.draftDetails}>
                                            <span className={styles.draftTag}>#{idx + 1}</span>
                                            <strong>{trade.symbol}</strong>
                                            <span className={styles.draftType}>{trade.type?.toUpperCase()}</span>
                                            <span>Volume: {trade.volume}</span>
                                            <span>Profit: <span className={trade.profit >= 0 ? styles.profitPos : styles.profitNeg}>{trade.profit}</span></span>
                                        </div>
                                        <button 
                                            type="button" 
                                            className={styles.removeBtn}
                                            onClick={() => handleRemoveDraft(trade._localId)}
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.colgrid}>
                            <div>
                                <Input 
                                    label='Position ID *' 
                                    name='position'
                                    placeholder='e.g. 1295279' 
                                    value={formData.position}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.position && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.position}</span>}
                            </div>
                            <div>
                                <Input 
                                    label='Symbol *' 
                                    name='symbol'
                                    placeholder='e.g. XAUUSD' 
                                    value={formData.symbol}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    maxLength={30}
                                    spacingRemove 
                                />
                                {errors.symbol && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.symbol}</span>}
                            </div>
                            <div className={styles.typeToggle}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#141414', fontFamily: 'var(--font-manrope)' }}>Trade Type *</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'type', value: 'buy' }})}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: formData.type === 'buy' ? '2px solid #22C55E' : '1px solid #E2E8F0', background: formData.type === 'buy' ? 'rgba(34, 197, 94, 0.1)' : '#FFF', color: formData.type === 'buy' ? '#15803D' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        Buy
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'type', value: 'sell' }})}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: formData.type === 'sell' ? '2px solid #EF4444' : '1px solid #E2E8F0', background: formData.type === 'sell' ? 'rgba(239, 68, 68, 0.1)' : '#FFF', color: formData.type === 'sell' ? '#B91C1C' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        Sell
                                    </button>
                                </div>
                            </div>
                            <div>
                                <Input 
                                    type="text"
                                    label='Volume *' 
                                    name='volume'
                                    placeholder='e.g. 0.05' 
                                    value={formData.volume}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.volume && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.volume}</span>}
                            </div>

                            <div>
                                <DateTimeInput
                                    label="Entry Time *"
                                    name="entry_time"
                                    value={formData.entry_time}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {errors.entry_time && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.entry_time}</span>}
                            </div>
                            <div>
                                <DateTimeInput
                                    label="Exit Time *"
                                    name="exit_time"
                                    value={formData.exit_time}
                                    min={formData.entry_time ? formData.entry_time.substring(0, 10).replace(/\./g, '-') : undefined}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {errors.exit_time && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.exit_time}</span>}
                            </div>

                            <div>
                                <Input 
                                    type="text"
                                    label='Entry Price *' 
                                    name='entry_price'
                                    placeholder='e.g. 4330.24' 
                                    value={formData.entry_price}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.entry_price && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.entry_price}</span>}
                            </div>
                            <div>
                                <Input 
                                    type="text"
                                    label='Exit Price *' 
                                    name='exit_price'
                                    placeholder='e.g. 4357.71' 
                                    value={formData.exit_price}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.exit_price && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.exit_price}</span>}
                            </div>

                            <div>
                                <Input 
                                    type="text"
                                    label='Stop Loss' 
                                    name='stop_loss'
                                    placeholder='e.g. 4300.00' 
                                    value={formData.stop_loss}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.stop_loss && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.stop_loss}</span>}
                            </div>
                            <div>
                                <Input 
                                    type="text"
                                    label='Take Profit' 
                                    name='take_profit'
                                    placeholder='e.g. 4400.00' 
                                    value={formData.take_profit}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.take_profit && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.take_profit}</span>}
                            </div>

                            <div>
                                <Input 
                                    label='Commission' 
                                    name='commission'
                                    placeholder='e.g. 0.00' 
                                    value={formData.commission}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.commission && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.commission}</span>}
                            </div>
                            <div>
                                <Input 
                                    label='Swap' 
                                    name='swap'
                                    placeholder='e.g. 0.00' 
                                    value={formData.swap}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.swap && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.swap}</span>}
                            </div>

                            <div>
                                <Input 
                                    label='Profit *' 
                                    name='profit'
                                    placeholder='e.g. -38.94' 
                                    value={formData.profit}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.profit && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.profit}</span>}
                            </div>
                            <div>
                                <Input 
                                    label='Profit %' 
                                    name='profit_percent'
                                    placeholder='e.g. -0.9' 
                                    value={formData.profit_percent}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.profit_percent && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.profit_percent}</span>}
                            </div>
                        </div>
                    </form>
                </div>

                <div className={styles.buttonGrid}>
                    <Button 
                        type="button" 
                        icon={Close} 
                        text="Cancel" 
                        primaryOutline 
                        onClick={handleAttemptClose} 
                        disabled={isLoading} 
                    />
                    <Button 
                        type="button" 
                        icon={SubmitIcon} 
                        text="Add to List" 
                        primaryOutline
                        onClick={handleAddDraft} 
                        disabled={isLoading} 
                    />
                    <Button 
                        type="button" 
                        icon={RightIcon} 
                        text={isLoading ? "Saving..." : `Save (${draftTrades.length + (Object.values(formData).some(val => val !== '' && val !== '0' && val !== 'buy') ? 1 : 0)})`} 
                        onClick={handleSubmit}
                        disabled={isLoading} 
                    />
                </div>
            </div>

            {showCancelConfirm && (
                <LogoutModal
                    message="Are you sure you want to discard the entered details?"
                    confirmText="Yes"
                    confirmIcon="/assets/icons/right.svg"
                    danger={true}
                    onConfirm={() => {
                        setShowCancelConfirm(false);
                        onClose();
                    }}
                    onCancel={() => setShowCancelConfirm(false)}
                />
            )}
        </div>
    );
}
