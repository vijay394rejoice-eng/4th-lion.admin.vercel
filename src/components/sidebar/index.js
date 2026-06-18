'use client'
import React from 'react'
import { usePathname } from 'next/navigation';
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

const Logo = '/assets/logo/logo.svg';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon },
    { label: 'Users', path: '/users', Icon: UserGroupIcon },
    { label: 'Trades', path: '/trades', Icon: TradesIcon },
    { label: 'Commission', path: '/commission', Icon: CommissionIcon },
    { label: 'Withdraw Requests', path: '/withdraw-requests', Icon: WithdrawIcon },
    { label: 'Deposits', path: '/deposits', Icon: WithdrawIcon },
    { label: 'DP Requests', path: '/dp-requests', Icon: RequestIcon },
    { label: 'KYC Requests', path: '/kyc-requests', Icon: KycIcon },
    { label: 'Send Notifications', path: '/send-notifications', Icon: CheckboxIcon },
    { label: 'Sub-Admins', path: '/sub-admins', Icon: AdminIcon },
    { label: 'Settings', path: '/settings', Icon: SettingIcon },
  ];

  return (
    <aside className={styles.aside}>
      <div className={styles.logo}>
        <img src={Logo} alt='Logo' />
      </div>
      <div className={styles.asideBody}>
        {menuItems.map((item) => {
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
