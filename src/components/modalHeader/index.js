import React from 'react'
import styles from './modalHeader.module.scss';
export default function ModalHeader({ title }) {
    return (
        <div className={styles.modalHeader}>
            <h2>
                {title}
            </h2>
        </div>
    )
}
