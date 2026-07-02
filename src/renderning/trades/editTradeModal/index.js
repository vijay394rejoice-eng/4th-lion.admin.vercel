"use client";
import React, { useState, useEffect } from 'react';
import styles from './editTradeModal.module.scss';
import CloseIcon from '@/svg/closeIcon';
import Button from '@/components/button';
import Input from '@/components/input';
import { updateTrade } from '@/services/trades';
import toast from 'react-hot-toast';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fill all required fields");
            return;
        }

        const payload = {
            entry_time: formData.entry_time,
            position: formData.position ? parseInt(formData.position) : null,
            symbol: formData.symbol,
            trade_type: formData.trade_type || null,
            volume: formData.volume ? parseFloat(formData.volume) : null,
            entry_price: formData.entry_price ? parseFloat(formData.entry_price) : null,
            stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
            take_profit: formData.take_profit ? parseFloat(formData.take_profit) : null,
            exit_time: formData.exit_time,
            exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
            commission: formData.commission ? parseFloat(formData.commission) : 0,
            swap: formData.swap ? parseFloat(formData.swap) : 0,
            profit: formData.profit ? parseFloat(formData.profit) : null,
            profit_percent: formData.profit_percent ? parseFloat(formData.profit_percent) : null
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
        <div className={styles.editTradeModal} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
                                    spacingRemove 
                                />
                                {errors.symbol && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{errors.symbol}</span>}
                            </div>

                            <div className={styles.selectWrapper}>
                                <label>Type *</label>
                                <select 
                                    name="trade_type" 
                                    value={formData.trade_type} 
                                    onChange={handleChange}
                                    disabled={isLoading}
                                >
                                    <option value="buy">BUY</option>
                                    <option value="sell">SELL</option>
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
                                    label='Entry Time *' 
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
                                    label='Exit Time *' 
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
                                    label='Commission' 
                                    name='commission'
                                    placeholder='e.g. 0' 
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
                                    placeholder='e.g. 0' 
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
                        icon={SaveIcon} 
                        text={isLoading ? "Saving..." : "Save"} 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        type="submit"
                        form="edit-trade-form"
                    />
                    <Button 
                        icon={CloseIconPath} 
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
