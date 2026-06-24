import React from 'react'
import styles from './textarea.module.scss';
export default function Textarea({ label, ...props }) {
    return (
        <div className={styles.textarea}>
            {label && (
                <label>
                    {label}
                </label>
            )}
            <textarea {...props}></textarea>
        </div>
    )
}
