import React from 'react'
import styles from './input.module.scss';
import classNames from 'classnames';

// Matches all emoji / pictographic characters
const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

export default function Input({ 
    label, 
    placeholder, 
    leftIcon, 
    spacingRemove, 
    rightSpacingRemove, 
    rightIcon, 
    onRightIconClick,
    type = 'text',
    onChange,
    ...props 
}) {
    const handleChange = (e) => {
        if (!onChange) return;
        const stripped = e.target.value.replace(EMOJI_REGEX, '');
        if (stripped !== e.target.value) {
            // Mutate the native input value so the cursor stays sensible,
            // then forward the cleaned synthetic event
            e.target.value = stripped;
        }
        onChange(e);
    };

    return (
        <div className={classNames(styles.input, rightSpacingRemove ? styles.rightSpacingRemove : "", spacingRemove ? styles.spacingRemove : "")}>
            {label && (
                <label>
                    {label}
                </label>
            )}
            <div className={styles.relative}>
                <input type={type} placeholder={placeholder} onChange={handleChange} {...props} />
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
