'use client'
import React from 'react'
import styles from './sidebar.module.scss';
import DashboardIcon from '@/svg/dashboardIcon';
import PartenerIcon from '@/svg/partenerIcon';
import TradesIcon from '@/svg/tradesIcon';
import TransactionsIcon from '@/svg/transactionsIcon';
import MyClientsIcon from '@/svg/myClientsIcon';
import ProfitSharingIcon from '@/svg/profitSharingIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import UserIcon from '@/svg/userIcon';
import UserGroupIcon from '@/svg/userGroupIcon';
import CommissionIcon from '@/svg/commissionIcon';
import WithdrawIcon from '@/svg/withdrawIcon';
import RequestIcon from '@/svg/requestIcon';
import KycIcon from '@/svg/kycIcon';
import CheckboxIcon from '@/svg/checkboxIcon';
import AdminIcon from '@/svg/adminIcon';
import SettingIcon from '@/svg/settingIcon';
const Logo = '/assets/logo/logo.svg';

export default function Sidebar() {
  const [isPartnerOpen, setIsPartnerOpen] = useState(true);

  const dropdownVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.logo}>
        <img src={Logo} alt='Logo' />
      </div>
      <div className={styles.asideBody}>
        <div className={styles.menu}>
          <DashboardIcon />
          <span>
            Dashboard
          </span>
        </div>
        <div className={styles.menu}>
          <UserGroupIcon />
          <span>
            Users
          </span>
        </div>
        <div className={styles.menu}>
          <CommissionIcon />
          <span>
            Commission
          </span>
        </div>
        <div className={styles.menu}>
          <WithdrawIcon />
          <span>
            Withdraw Requests
          </span>
        </div>
        <div className={styles.menu}>
          <WithdrawIcon />
          <span>
            Deposits
          </span>
        </div>
        <div className={styles.menu}>
          <RequestIcon />
          <span>
            DP Requests
          </span>
        </div>
        <div className={styles.menu}>
          <KycIcon />
          <span>
            KYC Requests
          </span>
        </div>
        <div className={styles.menu}>
          <CheckboxIcon />
          <span>
            Send Notifications
          </span>
        </div>
        <div className={styles.menu}>
          <AdminIcon />
          <span>
            Sub-Admins
          </span>
        </div>
        <div className={styles.menu}>
          <SettingIcon />
          <span>
            Settings
          </span>
        </div>

      </div>
    </aside>
  )
}
