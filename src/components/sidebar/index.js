'use client'
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './sidebar.module.scss';
import DashboardIcon from '@/svg/dashboardIcon';
import UserGroupIcon from '@/svg/userGroupIcon';
import CommissionIcon from '@/svg/commissionIcon';
import WithdrawIcon from '@/svg/withdrawIcon';
import RequestIcon from '@/svg/requestIcon';
import KycIcon from '@/svg/kycIcon';
import CheckboxIcon from '@/svg/checkboxIcon';
import AdminIcon from '@/svg/adminIcon';
import SettingIcon from '@/svg/settingIcon';
import TradesIcon from '@/svg/tradesIcon';
import { hasRoutePermission } from '@/utils/permissions';
import { getMe } from '@/services/auth';

const Logo = '/assets/logo/logo.svg';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    document.querySelector('.sidebar-layout')?.classList.remove('active');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
  }, [pathname]);

  // Load permissions on mount
  useEffect(() => {
    setIsMounted(true);
    const savedRole = localStorage.getItem('user_role');
    const savedPermissions = localStorage.getItem('permissions');
    
    if (savedRole) setRole(savedRole);
    if (savedPermissions) {
      try {
        setPermissions(JSON.parse(savedPermissions));
      } catch (e) {
        console.error("Failed to parse permissions from localStorage:", e);
      }
    }

    const fetchLatestProfile = async () => {
      try {
        const res = await getMe();
        if (res && res.status === 1) {
          const userData = res.data;
          setRole(userData.role || '');
          setPermissions(userData.permissions || []);
          localStorage.setItem('user_role', userData.role || '');
          localStorage.setItem('permissions', JSON.stringify(userData.permissions || []));
        }
      } catch (err) {
        console.error("Failed to fetch fresh user profile:", err);
      }
    };

    fetchLatestProfile();
  }, []);

  const closeSidebar = () => {
    document.querySelector('.sidebar-layout')?.classList.remove('active');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon },
    { label: 'Users', path: '/users', Icon: UserGroupIcon },
    { label: 'Trades', path: '/trades', Icon: TradesIcon },
    { label: 'Profit Sharing', path: '/profit-sharing', Icon: CommissionIcon },
    { label: 'Withdraw Requests', path: '/withdraw-requests', Icon: WithdrawIcon },
    { label: 'Deposits', path: '/deposits', Icon: WithdrawIcon },
    { label: 'DP Requests', path: '/dp-requests', Icon: RequestIcon },
    { label: 'KYC Requests', path: '/kyc-requests', Icon: KycIcon },
    { label: 'Send Notifications', path: '/notifications', Icon: CheckboxIcon },
    { label: 'Sub-Admins', path: '/sub-admins', Icon: AdminIcon },
    { label: 'Settings', path: '/settings', Icon: SettingIcon },
  ];

  // Filter menu items based on sub-admin permissions
  const visibleMenuItems = isMounted
    ? menuItems.filter(item => hasRoutePermission(item.path, role, permissions))
    : [];

  return (
    <aside className={styles.aside}>
      <div className={styles.logo}>
        <img src={Logo} alt='Logo' onClick={() =>  router.push("/dashboard")} />
        <button className={styles.closeBtn} onClick={closeSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.asideBody}>
        {visibleMenuItems.map((item) => {
          const Icon = item.Icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.menu} ${isActive ? styles.activeMenu : ''}`}
            >
              <Icon />
              <span>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  )
}
