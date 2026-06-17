import React from 'react'
import styles from './input.module.scss';
import classNames from 'classnames';
export default function Input({ label, placeholder, leftIcon, spacingRemove, rightSpacingRemove, rightIcon }) {
    return (
        <div className={classNames(styles.input, rightSpacingRemove ? styles.rightSpacingRemove : "", spacingRemove ? styles.spacingRemove : "")}>
            <label>
                {label}
            </label>
            <div className={styles.relative}>
                <input type='text' placeholder={placeholder} />
                <div className={styles.leftIconalignment}>
                    <img src={leftIcon} alt={leftIcon} />
                </div>
                <div className={styles.rightIconalignment}>
                    <img src={rightIcon} alt={rightIcon} />
                </div>
            </div>
        </div>
    )
}
