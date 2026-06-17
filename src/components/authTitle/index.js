import React from 'react'
import styles from './authTitle.module.scss';
const Logo = '/assets/logo/logo.svg';
export default function AuthTitle({ title, desc }) {
    return (
        <div className={styles.authTitle}>
            <div className={styles.centerLogo}>
                <img src={Logo} alt='Logo' />
            </div>
            <h1>
                {title}
            </h1>

        </div>
    )
}
