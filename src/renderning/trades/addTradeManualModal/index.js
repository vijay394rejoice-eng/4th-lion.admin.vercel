"use client";
import React, { useState } from 'react';
import styles from './addTradeManualModal.module.scss';
import CloseIcon from '@/svg/closeIcon';
import Button from '@/components/button';
import Input from '@/components/input';
import { createTradeManual } from '@/services/trades';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
const Close = '/assets/icons/close.svg';
const SubmitIcon = '/assets/icons/right.svg'; // Reuse right icon for add

const defaultForm = {
    entry_time: '',
    position: '',
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

    const validate = () => {
        const newErrors = {};
        if (!formData.entry_time) newErrors.entry_time = 'Entry time is required';
        if (!formData.position) newErrors.position = 'Position ID is required';
        if (!formData.symbol) newErrors.symbol = 'Symbol is required';
        if (!formData.volume) newErrors.volume = 'Volume is required';
        if (!formData.entry_price) newErrors.entry_price = 'Entry price is required';
        if (!formData.exit_time) newErrors.exit_time = 'Exit time is required';
        if (!formData.exit_price) newErrors.exit_price = 'Exit price is required';
        if (!formData.profit) newErrors.profit = 'Profit is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const parseTrade = (form) => {
        return {
            entry_time: form.entry_time,
            position: form.position ? parseInt(form.position) : null,
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
        if (!validate()) {
            toast.error("Please fill all required fields to add the trade");
            return;
        }
        const newTrade = parseTrade(formData);
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
            if (!validate()) {
                toast.error("Please complete the current trade form or clear it before saving");
                return;
            }
            const currentTrade = parseTrade(formData);
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
            toast.error(err?.message || "Something went wrong while saving trades");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.addTradeManualModal} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalheader}>
                    <div>
                        <h2>Add Trade Details (Multiple)</h2>
                    </div>
                    <div className={styles.rightAlignment} onClick={onClose}>
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
                                    spacingRemove 
                                />
                                {errors.symbol && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.symbol}</span>}
                            </div>
                            
                            <div className={styles.selectWrapper}>
                                <label>Trade Type *</label>
                                <select 
                                    name='type'
                                    value={formData.type}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                >
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                            </div>
                            <div>
                                <Input 
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
                                <Input 
                                    label='Entry Time * (YYYY.MM.DD HH:MM:SS)' 
                                    name='entry_time'
                                    placeholder='e.g. 2026.06.10 14:41:06' 
                                    value={formData.entry_time}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.entry_time && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.entry_time}</span>}
                            </div>
                            <div>
                                <Input 
                                    label='Exit Time * (YYYY.MM.DD HH:MM:SS)' 
                                    name='exit_time'
                                    placeholder='e.g. 2026.06.08 13:46:01' 
                                    value={formData.exit_time}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                                {errors.exit_time && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.exit_time}</span>}
                            </div>

                            <div>
                                <Input 
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
                                    label='Stop Loss' 
                                    name='stop_loss'
                                    placeholder='e.g. 4300.00' 
                                    value={formData.stop_loss}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
                            </div>
                            <div>
                                <Input 
                                    label='Take Profit' 
                                    name='take_profit'
                                    placeholder='e.g. 4400.00' 
                                    value={formData.take_profit}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    spacingRemove 
                                />
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
                        onClick={onClose} 
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
        </div>
    );
}
