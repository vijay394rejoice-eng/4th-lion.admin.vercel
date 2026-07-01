"use client";
import React, { useState, useEffect } from 'react';
import styles from './dashboardCardList.module.scss';
import DolorIcon from '@/svg/dolorIcon';
import ProfitIcon from '@/svg/profitIcon';
import ProfitSharingIcon from '@/svg/profitSharingIcon';
import UserGroupIcon from '@/svg/userGroupIcon';
import CommissionIcon from '@/svg/commissionIcon';
import TradesIcon from '@/svg/tradesIcon';
import { getAdminMetrics } from '@/services/dashboard';

const cardsConfig = [
  {
    key: 'total_deposits',
    title: 'Total Deposits',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: false,
  },
  {
    key: 'gross_pnl',
    title: 'Gross Profit',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: true,
  },
  {
    key: 'net_pnl',
    title: 'Net Profit',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: true,
  },
  {
    key: 'profit_sharing_paid',
    title: 'Profit Sharing Paid',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: true,
  },
  {
    key: 'company_profit',
    title: 'Company Profit',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: false,
  },
  {
    key: 'total_users',
    title: 'Total Users',
    icon: <DolorIcon />,
    isCurrency: false,
    hasTimeframe: false,
  },
    {
    key: 'total_partners',
    title: 'Total Partners',
    icon: <DolorIcon />,
    isCurrency: false,
    hasTimeframe: false,
  },
  {
    key: 'all_users_account_balance',
    title: 'All Users Account Balance',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: false,
  },
  {
    key: 'partner_commission_paid',
    title: 'Partner Commission Paid',
    icon: <DolorIcon />,
    isCurrency: true,
    hasTimeframe: false,
  },
  {
    key: 'total_lots_traded',
    title: 'Total Lots Traded',
    icon: <DolorIcon />,
    isCurrency: false,
    hasTimeframe: true,
  },
];

export default function DashboardCardList() {
  const [timeframes, setTimeframes] = useState({
    gross_pnl: '24h',
    net_pnl: '24h',
    profit_sharing_paid: '24h',
    total_lots_traded: '24h',
  });

  const [metricsData, setMetricsData] = useState({});
  const [loadingTimeframes, setLoadingTimeframes] = useState({
    all: true,
    '24h': true,
    '7d': false,
    '30d': false,
  });

  useEffect(() => {
    let active = true;
    const requiredTimeframes = Array.from(
      new Set([
        'all',
        timeframes.gross_pnl,
        timeframes.net_pnl,
        timeframes.profit_sharing_paid,
        timeframes.total_lots_traded,
      ])
    );

    // Filter down to the timeframes we haven't loaded yet
    const toFetch = requiredTimeframes.filter((tf) => !metricsData[tf]);

    if (toFetch.length === 0) {
      return;
    }

    setLoadingTimeframes((prev) => {
      const next = { ...prev };
      toFetch.forEach((tf) => {
        next[tf] = true;
      });
      return next;
    });

    const fetchTimeframes = async () => {
      const results = await Promise.all(
        toFetch.map(async (tf) => {
          try {
            const res = await getAdminMetrics(tf);
            if (res && res.status === 1) {
              return { tf, data: res.data };
            }
          } catch (e) {
            console.error(`Failed to fetch metrics for timeframe ${tf}:`, e);
          }
          return { tf, data: null };
        })
      );

      if (active) {
        setMetricsData((prev) => {
          const next = { ...prev };
          results.forEach(({ tf, data }) => {
            if (data) {
              next[tf] = data;
            }
          });
          return next;
        });

        setLoadingTimeframes((prev) => {
          const next = { ...prev };
          toFetch.forEach((tf) => {
            next[tf] = false;
          });
          return next;
        });
      }
    };

    fetchTimeframes();

    return () => {
      active = false;
    };
  }, [
    timeframes.gross_pnl,
    timeframes.net_pnl,
    timeframes.profit_sharing_paid,
    timeframes.total_lots_traded,
  ]);

  const handleTimeframeChange = (cardKey, value) => {
    setTimeframes((prev) => ({
      ...prev,
      [cardKey]: value,
    }));
  };

  return (
    <div className={styles.dashboardCardList}>
      {cardsConfig.map((card) => {
        const cardTimeframe = card.hasTimeframe ? timeframes[card.key] : 'all';
        const isCardLoading =
          loadingTimeframes[cardTimeframe] || !metricsData[cardTimeframe];
        const value = metricsData[cardTimeframe]?.[card.key] ?? 0;

        return (
          <div className={styles.items} key={card.key}>
            <div className={styles.icon}>{card.icon}</div>

            <div className={styles.cardHeader}>
              <h3>{card.title}</h3>
              {card.hasTimeframe && (
                <select
                  className={styles.timeframeSelect}
                  value={cardTimeframe}
                  onChange={(e) => handleTimeframeChange(card.key, e.target.value)}
                >
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="all">All Time</option>
                </select>
              )}
            </div>

            {isCardLoading ? (
              <span
                className={styles.skeleton}
                style={{ width: '120px', height: '32px', marginTop: '4px' }}
              />
            ) : (
              <p>
                {card.isCurrency
                  ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
                  : value.toLocaleString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
