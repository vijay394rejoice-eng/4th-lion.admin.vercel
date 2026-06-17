'use client'
import React from 'react'
import { motion } from 'framer-motion';
import styles from './button.module.scss';
import classNames from 'classnames';

export default function Button({ text, icon, outline }) {
    return (
        <div className={classNames(styles.button, outline ? styles.outline : "")}>
            <motion.button
                aria-label={text}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {text}
                {icon && <img src={icon} alt={text} />}
            </motion.button>
        </div>
    )
}
