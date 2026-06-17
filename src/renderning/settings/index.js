'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import styles from './settings.module.scss';
import RightIcon from '@/svg/rightIcon';
import ProfitIcon from '@/svg/profitIcon';
import Withdraw from '@/svg/withdraw';
import ChangeIcon from '@/svg/changeIcon';
import ProfitShareSetup from './profitShareSetup';
import MinimumWithdraw from './minimumWithdraw';
import ChangePassword from './changePassword';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profit');

    const menuItems = [
        { id: 'profit', label: 'Profit Share Setup', Icon: ProfitIcon },
        { id: 'withdraw', label: 'Minimum Withdraw Amount', Icon: Withdraw },
        { id: 'password', label: 'Change Password', Icon: ChangeIcon },
    ];

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'profit':
                return <ProfitShareSetup />;
            case 'withdraw':
                return <MinimumWithdraw />;
            case 'password':
                return <ChangePassword />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.settingsCenter}>
            <div className={styles.grid}>
                <div className={styles.items}>
                    <div className={styles.sidebar}>
                        {menuItems.map((item) => {
                            const Icon = item.Icon;
                            const isActive = activeTab === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`${styles.menu} ${isActive ? styles.active : ''}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabPill"
                                            className={styles.activeBg}
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <div className={styles.left}>
                                        <Icon />
                                        <span>
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className={styles.icon}>
                                        <RightIcon />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.items}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            {renderActiveComponent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

