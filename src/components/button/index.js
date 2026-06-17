'use client'
import React from 'react'
import { motion } from 'framer-motion';
import styles from './button.module.scss';
import classNames from 'classnames';

export default function Button({ text, icon, outline, danger, primaryOutline, disabled, ...props }) {
    return (
        <div className={classNames(styles.button, outline ? styles.outline : "", disabled ? styles.disabled : "", primaryOutline ? styles.primaryOutline : "", danger ? styles.danger : "")}>
            <motion.button
                aria-label={text}
                whileHover={disabled ? {} : { scale: 1.05 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                disabled={disabled}
                {...props}
            >
                {text}
                {typeof icon === "string" && <img src={icon} alt={text} />}
                {typeof icon === "object" && icon}
            </motion.button>
        </div>
    )
}
