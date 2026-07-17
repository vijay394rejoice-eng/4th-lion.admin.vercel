"use client";
import React, { useState, useEffect } from 'react';
import styles from './editTradeModal.module.scss';
import CloseIcon from '@/svg/closeIcon';
import Button from '@/components/button';
import Input from '@/components/input';
import DateTimeInput from '@/components/dateTimeInput';
import { updateTrade } from '@/services/trades';
import toast from 'react-hot-toast';
import { validateTradeData } from '@/utils/tradeValidation';

const SaveIcon = '/assets/icons/right.svg';
const CloseIconPath = '/assets/icons/close.svg';

export default function EditTradeModal({ trade, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        entry_time: '',
        position: '',
        symbol: '',
        trade_type: 'buy',
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
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (trade) {
            setFormData({
                entry_time: trade.entry_time || '',
                position: trade.position !== null && trade.position !== undefined ? String(trade.position) : '',
                symbol: trade.symbol || '',
                trade_type: trade.trade_type || 'buy',
                volume: trade.volume !== null && trade.volume !== undefined ? String(trade.volume) : '',
                entry_price: trade.entry_price !== null && trade.entry_price !== undefined ? String(trade.entry_price) : '',
                stop_loss: trade.stop_loss !== null && trade.stop_loss !== undefined ? String(trade.stop_loss) : '',
                take_profit: trade.take_profit !== null && trade.take_profit !== undefined ? String(trade.take_profit) : '',
                exit_time: trade.exit_time || '',
                exit_price: trade.exit_price !== null && trade.exit_price !== undefined ? String(trade.exit_price) : '',
                commission: trade.commission !== null && trade.commission !== undefined ? String(trade.commission) : '0',
                swap: trade.swap !== null && trade.swap !== undefined ? String(trade.swap) : '0',
                profit: trade.profit !== null && trade.profit !== undefined ? String(trade.profit) : '',
                profit_percent: trade.profit_percent !== null && trade.profit_percent !== undefined ? String(trade.profit_percent) : ''
            });
        }
    }, [trade]);

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
        
        setFormData(trimmedData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 ? trimmedData : false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validatedData = validate();
        if (!validatedData) {
            toast.error("Please fix the validation errors");
            return;
        }

        const payload = {
            entry_time: validatedData.entry_time,
            position: validatedData.position ? validatedData.position.toString() : null,
            symbol: validatedData.symbol,
            trade_type: validatedData.trade_type || null,
            volume: validatedData.volume ? parseFloat(validatedData.volume) : null,
            entry_price: validatedData.entry_price ? parseFloat(validatedData.entry_price) : null,
            stop_loss: validatedData.stop_loss ? parseFloat(validatedData.stop_loss) : null,
            take_profit: validatedData.take_profit ? parseFloat(validatedData.take_profit) : null,
            exit_time: validatedData.exit_time,
            exit_price: validatedData.exit_price ? parseFloat(validatedData.exit_price) : null,
            commission: validatedData.commission ? parseFloat(validatedData.commission) : 0,
            swap: validatedData.swap ? parseFloat(validatedData.swap) : 0,
            profit: validatedData.profit ? parseFloat(validatedData.profit) : null,
            profit_percent: validatedData.profit_percent ? parseFloat(validatedData.profit_percent) : null
        };

        setIsLoading(true);
        try {
            const res = await updateTrade(trade.id, payload);
            if (res && res.status === 1) {
                toast.success(res.message || "Trade updated successfully!");
                if (onSuccess) onSuccess();
                onClose();
            } else {
                toast.error(res?.message || "Failed to update trade");
            }
        } catch (err) {
            console.error("Failed to update trade:", err);
            // toast.error is handled by api.js globally on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.editTradeModal}>
            <div className={styles.modal}>
                <div className={styles.modalheader}>
                    <div>
                        <h2>Edit Trade Details</h2>
                    </div>
                    <div className={styles.rightAlignment} onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>
                
                <div className={styles.modalBody}>
                    <form onSubmit={handleSubmit} id="edit-trade-form">
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
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#141414', fontFamily: 'var(--font-manrope)' }}>Type *</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'trade_type', value: 'buy' }})}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: formData.trade_type === 'buy' ? '2px solid #22C55E' : '1px solid #E2E8F0', background: formData.trade_type === 'buy' ? 'rgba(34, 197, 94, 0.1)' : '#FFF', color: formData.trade_type === 'buy' ? '#15803D' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        BUY
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'trade_type', value: 'sell' }})}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: formData.trade_type === 'sell' ? '2px solid #EF4444' : '1px solid #E2E8F0', background: formData.trade_type === 'sell' ? 'rgba(239, 68, 68, 0.1)' : '#FFF', color: formData.trade_type === 'sell' ? '#B91C1C' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        SELL
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
                                    label='Commission' 
                                    name='commission'
                                    placeholder='e.g. 0' 
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
                                    placeholder='e.g. 0' 
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
                        // icon={SaveIcon} 
                        text={isLoading ? "Saving..." : "Save"} 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        type="submit"
                        form="edit-trade-form"
                    />
                    <Button 
                        // icon={CloseIconPath} 
                        text="Cancel" 
                        primaryOutline 
                        onClick={onClose}
                        disabled={isLoading}
                        type="button"
                    />
                </div>
            </div>
        </div>
    );
}
