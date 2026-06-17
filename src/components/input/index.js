import React from 'react'
import styles from './input.module.scss';
import classNames from 'classnames';

export default function Input({ 
    label, 
    placeholder, 
    leftIcon, 
    spacingRemove, 
    rightSpacingRemove, 
    rightIcon, 
    onRightIconClick,
    type = 'text',
    ...props 
}) {
    return (
        <div className={classNames(styles.input, rightSpacingRemove ? styles.rightSpacingRemove : "", spacingRemove ? styles.spacingRemove : "")}>
            {label && (
                <label>
                    {label}
                </label>
            )}
            <div className={styles.relative}>
                <input type={type} placeholder={placeholder} {...props} />
                {leftIcon && (
                    <div className={styles.leftIconalignment}>
                        <img src={leftIcon} alt={leftIcon} />
                    </div>
                )}
                {rightIcon && (
                    <div className={styles.rightIconalignment} onClick={onRightIconClick}>
                        <img src={rightIcon} alt={rightIcon} />
                    </div>
                )}
            </div>
        </div>
    )
}
