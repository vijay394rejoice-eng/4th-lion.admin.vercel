import React from 'react'
import styles from './textarea.module.scss';
export default function Textarea({ label }) {
    return (
        <div className={styles.textarea}>
            <label>
                {label}
            </label>
            <textarea></textarea>
        </div>
    )
}
