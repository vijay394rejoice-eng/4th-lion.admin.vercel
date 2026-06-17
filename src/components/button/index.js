'use client'
import React from 'react'
import { motion } from 'framer-motion';
import styles from './button.module.scss';
import classNames from 'classnames';

export default function Button({ text, icon, outline, disabled, ...props }) {
    return (
        <div className={classNames(styles.button, outline ? styles.outline : "", disabled ? styles.disabled : "")}>
            <motion.button
                aria-label={text}
                whileHover={disabled ? {} : { scale: 1.05 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                disabled={disabled}
                {...props}
            >
                {text}
                {icon && <img src={icon} alt={text} />}
            </motion.button>
        </div>
    )
}
