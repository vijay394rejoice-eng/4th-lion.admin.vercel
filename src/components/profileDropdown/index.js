'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './profileDropdown.module.scss';
import UserIcon from '@/svg/userIcon';
import EditIcon from '@/svg/editIcon';
import KeyIcon from '@/svg/keyIcon';
import LogoutIcon from '@/svg/logoutIcon';
import ChevronRightIcon from '@/svg/chevronRightIcon';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: <EditIcon />,
      onClick: () => {
        console.log('Edit Profile Clicked');
        setIsOpen(false);
      }
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: <KeyIcon />,
      onClick: () => {
        console.log('Change Password Clicked');
        setIsOpen(false);
      }
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogoutIcon />,
      onClick: () => {
        console.log('Logout Clicked');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className={styles.profileDropdownWrapper} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleDropdown}>
        <UserIcon />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownMenu}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className={styles.profileHeader}>
              <div className={styles.profileDetails}>
                <h4 className={styles.name}>John Doe</h4>
                <p className={styles.email}>johnathandoe@gmail.com</p>
              </div>
              <div className={styles.kycBadge}>
                KYC Verified
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.menuList}>
              {menuItems.map((item) => (
                <div key={item.id} className={styles.menuItem} onClick={item.onClick}>
                  <div className={styles.itemLeft}>
                    <div className={styles.iconWrapper}>
                      {item.icon}
                    </div>
                    <span className={styles.label}>{item.label}</span>
                  </div>
                  <div className={styles.chevronWrapper}>
                    <ChevronRightIcon />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
