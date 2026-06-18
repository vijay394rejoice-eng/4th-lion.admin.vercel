'use client';
import React from 'react'
import { usePathname } from 'next/navigation';
import styles from './header.module.scss';
import NotificationDropdown from '../notificationDropdown';
import ProfileDropdown from '../profileDropdown';
import titles from './titles.json';

export default function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (!pathname) return 'Dashboard';
    if (titles[pathname]) return titles[pathname];

    // Find prefix match, prioritizing longer matching prefixes
    const matchedKey = Object.keys(titles)
      .sort((a, b) => b.length - a.length)
      .find(key => pathname.startsWith(key) && key !== '/');

    return matchedKey ? titles[matchedKey] : 'Dashboard';
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h2>
          {getTitle()}
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
