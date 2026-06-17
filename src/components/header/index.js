import React from 'react'
import styles from './header.module.scss';
import NotificationDropdown from '../notificationDropdown';
import ProfileDropdown from '../profileDropdown';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h2>
          Dashboard
        </h2>
      </div>
      <div className={styles.rightAlignment}>
        <div className={styles.bellIcon}>
          <NotificationDropdown />
        </div>
        <ProfileDropdown />
      </div>
    </header>
  )
}
