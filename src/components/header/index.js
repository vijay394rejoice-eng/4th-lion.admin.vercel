'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './header.module.scss';
import NotificationDropdown from '../notificationDropdown';
import ProfileDropdown from '../profileDropdown';
import titles from './titles.json';
import { activatePendingUsers } from '@/services/user';
import toast from 'react-hot-toast';
import Button from '../button';

export default function Header() {
  const pathname = usePathname();
  const [isActivating, setIsActivating] = useState(false);

  const handleActivatePending = async () => {
    setIsActivating(true);
    try {
      const res = await activatePendingUsers();
      if (res && res.status === 1) {
        toast.success(res.message || "Pending users activated successfully!");
      } else {
        toast.error(res?.message || "Failed to activate pending users");
      }
    } catch (err) {
      console.error("Failed to activate pending users:", err);
      toast.error(err?.message || "Something went wrong while activating users");
    } finally {
      setIsActivating(false);
    }
  };

  const getTitle = () => {
    if (!pathname) return 'Dashboard';
    if (titles[pathname]) return titles[pathname];

    // Find prefix match, prioritizing longer matching prefixes
    const matchedKey = Object.keys(titles)
      .sort((a, b) => b.length - a.length)
      .find(key => pathname.startsWith(key) && key !== '/');

    return matchedKey ? titles[matchedKey] : 'Dashboard';
  };

  const toggleSidebar = () => {
    document.querySelector('.sidebar-layout')?.classList.toggle('active');
    document.querySelector('.sidebar-overlay')?.classList.toggle('active');
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftAlignment} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="mobile-header-toggle" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <div className={styles.title}>
          <h2>
            {getTitle()}
          </h2>
        </div>
      </div>
      <div className={styles.rightAlignment} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button 
            text={isActivating ? "Activating..." : "Activate  "} 
            primaryOutline 
            onClick={handleActivatePending}
            disabled={isActivating}
        />
        <div className={styles.bellIcon}>
          <NotificationDropdown />
        </div>
        <ProfileDropdown />
      </div>
    </header>
  )
}
