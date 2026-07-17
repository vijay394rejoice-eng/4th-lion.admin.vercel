import React from 'react';
import styles from './dateTimeInput.module.scss';

/**
 * DateTimeInput — replaces CustomDateTimePicker.
 * Stores/emits values in 'YYYY.MM.DD HH:mm:ss' format to stay compatible
 * with the existing trade form handling.
 */
export default function DateTimeInput({ label, name, value, onChange, disabled }) {
    // Parse 'YYYY.MM.DD HH:mm:ss' → { date: 'YYYY-MM-DD', time: 'HH:mm:ss' }
    const parsedDate = value ? value.substring(0, 10).replace(/\./g, '-') : '';
    const parsedTime = value ? value.substring(11) || '00:00:00' : '';

    const emit = (datePart, timePart) => {
        if (!datePart) {
            onChange({ target: { name, value: '' } });
            return;
        }
        const formatted = `${datePart.replace(/-/g, '.')  } ${timePart || '00:00:00'}`;
        onChange({ target: { name, value: formatted } });
    };

    const handleDateChange = (e) => {
        emit(e.target.value, parsedTime);
    };

    const handleTimeChange = (e) => {
        // Append seconds if the browser omits them (some browsers return HH:mm)
        const timeVal = e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value;
        emit(parsedDate, timeVal);
    };

    return (
        <div className={styles.dateTimeInput}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.row}>
                <input
                    type="date"
                    className={styles.field}
                    value={parsedDate}
                    onChange={handleDateChange}
                    disabled={disabled}
                />
                <input
                    type="time"
                    step="1"
                    className={styles.field}
                    value={parsedTime}
                    onChange={handleTimeChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
