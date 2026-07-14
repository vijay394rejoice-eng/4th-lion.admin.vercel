'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './notificationDropdown.module.scss';
import BellIcon from '@/svg/bellIcon';
import MegaphoneIcon from '@/svg/megaphoneIcon';

import { getNotifications, markNotificationRead } from '@/services/notifications';

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications({ page: 1, limit: 20 });
      const items = res?.data?.items || res?.items || res?.data || [];
      setNotifications(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const unreadCount = notifications.filter(n => !n.is_read && !n.isRead).length;

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markNotificationRead({ notification_ids: [], mark_all: true });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleRead = async (notif) => {
    const isRead = notif?.is_read || notif?.isRead;
    if (isRead) return;
    try {
      await markNotificationRead({ notification_ids: [notif.id], mark_all: false });
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleDropdown}>
        <BellIcon />
        {unreadCount > 0 && (
          <span className={styles.iconBadge} style={{ position: 'absolute', top: -5, right: -10, background: '#ec4343', color: '#fff', fontSize: '10px', minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
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
                <span className={styles.unreadBadge}>{unreadCount} Unread</span>
              </div>
              <button className={styles.markReadBtn} onClick={handleMarkAllRead}>Mark all as read</button>
            </div>

            <div className={styles.list}>
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  Loading notifications...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif, index) => {
                  const isRead = notif?.is_read || notif?.isRead;
                  const title = notif?.title || '';
                  const text = notif?.message || notif?.content || notif?.body || notif?.notification_text || 'New Notification';
                  const time = notif?.created_at || notif?.createdAt || notif?.time || '';

                  return (
                    <div 
                      key={notif.id || index} 
                      className={`${styles.item} ${isRead ? styles.read : ''}`}
                      onClick={() => handleRead(notif)}
                      style={{ cursor: isRead ? 'default' : 'pointer' }}
                    >
                      <div className={styles.iconWrapper}>
                        <MegaphoneIcon />
                      </div>
                      <div className={styles.content}>
                        {title && <h4 className={styles.title} style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{title}</h4>}
                        <p>{text}</p>
                        <span className={styles.time}>{formatDateTime(time)}</span>
                      </div>
                      {!isRead && <div className={styles.indicator}></div>}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  No notifications found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
