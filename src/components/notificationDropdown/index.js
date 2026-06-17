'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './notificationDropdown.module.scss';
import BellIcon from '@/svg/bellIcon';
import MegaphoneIcon from '@/svg/megaphoneIcon';

export default function NotificationDropdown() {
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

  const notifications = [
    {
      id: 1,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "4 Minutes Ago",
      isRead: false,
    },
    {
      id: 2,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "4 Minutes Ago",
      isRead: false,
    },
    {
      id: 3,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "4 Minutes Ago",
      isRead: false,
    },
    {
      id: 4,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "4 Minutes Ago",
      isRead: true,
    }
  ];

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleDropdown}>
        <BellIcon />
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
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <h3>Notifications</h3>
                <span className={styles.unreadBadge}>47 Unread</span>
              </div>
              <button className={styles.markReadBtn}>Mark all as read</button>
            </div>

            <div className={styles.list}>
              {notifications.map((notif) => (
                <div key={notif.id} className={`${styles.item} ${notif.isRead ? styles.read : ''}`}>
                  <div className={styles.iconWrapper}>
                    <MegaphoneIcon />
                  </div>
                  <div className={styles.content}>
                    <p>{notif.text}</p>
                    <span className={styles.time}>{notif.time}</span>
                  </div>
                  {!notif.isRead && <div className={styles.indicator}></div>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
