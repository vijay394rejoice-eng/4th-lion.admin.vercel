"use client";
import React, { useState, useEffect } from 'react';
import styles from './dashboardDetails.module.scss';
import DolorIcon from '@/svg/dolorIcon';
import WithdrawIcon from '@/svg/withdrawIcon';
import { getRecentTransactions, getAdminMetrics, getSharingModel, getPortfolioGrowth } from '@/services/dashboard';

const getCoordinatesForPercent = (percent) => {
    // percent from 0 to 1
    const x = 100 + 100 * Math.cos(2 * Math.PI * percent - Math.PI / 2);
    const y = 100 + 100 * Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return [x, y];
};

const getSlicePath = (startPercent, endPercent) => {
    if (endPercent - startPercent >= 1) {
        return "M 100 100 m -100 0 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0";
    }
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    return `M 100 100 L ${startX} ${startY} A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
};

const getLabelCoordinates = (percent, radiusScale = 0.5) => {
    const x = 100 + (100 * radiusScale) * Math.cos(2 * Math.PI * percent - Math.PI / 2);
    const y = 100 + (100 * radiusScale) * Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return [x, y];
};

const formatLabelDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day}-${month}`;
    } catch (e) {
        return dateStr;
    }
};

const formatTooltipDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    } catch (e) {
        return dateStr;
    }
};

const paddingLeft = 30;
const paddingRight = 30;
const paddingTop = 20;
const paddingBottom = 40;
const chartWidth = 500 - paddingLeft - paddingRight; // 440
const chartHeight = 250 - paddingTop - paddingBottom; // 190


const timeAgo = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);

        if (diffSec < 60) {
            return 'Just now';
        } else if (diffMin < 60) {
            return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHr < 24) {
            return `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays < 30) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    } catch (error) {
        return dateString;
    }
};

const formatTransactionType = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export default function DashboardDetails() {
    const [transactions, setTransactions] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [sharingModel, setSharingModel] = useState(null);
    const [chartTimeframe, setChartTimeframe] = useState('7d');
    const [chartData, setChartData] = useState([]);

    const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
    const [isMetricsLoading, setIsMetricsLoading] = useState(true);
    const [isSharingModelLoading, setIsSharingModelLoading] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(true);

    const [hoveredPoint, setHoveredPoint] = useState(null);

    useEffect(() => {
        let active = true;
        const fetchTransactions = async () => {
            try {
                const res = await getRecentTransactions(5);
                if (active && res && res.status === 1) {
                    setTransactions(res.data || []);
                }
            } catch (err) {
                console.error("Failed to load recent transactions:", err);
            } finally {
                if (active) {
                    setIsTransactionsLoading(false);
                }
            }
        };
        const fetchMetrics = async () => {
            try {
                const res = await getAdminMetrics('all');
                if (active && res && res.status === 1) {
                    setMetrics(res.data);
                }
            } catch (err) {
                console.error("Failed to load admin metrics:", err);
            } finally {
                if (active) {
                    setIsMetricsLoading(false);
                }
            }
        };
        const fetchSharingModel = async () => {
            try {
                const res = await getSharingModel();
                if (active && res && res.status === 1) {
                    setSharingModel(res.data);
                }
            } catch (err) {
                console.error("Failed to load sharing model:", err);
            } finally {
                if (active) {
                    setIsSharingModelLoading(false);
                }
            }
        };

        fetchTransactions();
        fetchMetrics();
        fetchSharingModel();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        const fetchChartData = async () => {
            setIsChartLoading(true);
            try {
                const res = await getPortfolioGrowth(chartTimeframe);
                if (active && res && res.status === 1) {
                    setChartData(res.data?.data || []);
                }
            } catch (err) {
                console.error("Failed to load portfolio growth:", err);
            } finally {
                if (active) {
                    setIsChartLoading(false);
                }
            }
        };
        fetchChartData();
        return () => {
            active = false;
        };
    }, [chartTimeframe]);

    // Calculate dynamic values for sharing model SVG path
    const investorPct = sharingModel?.investor_percentage ?? 50;
    const ibPct = sharingModel?.ib_percentage ?? 20;
    const companyPct = sharingModel?.company_percentage ?? 30;

    const ibVal = ibPct / 100;
    const companyVal = companyPct / 100;
    const investorVal = investorPct / 100;

    const ibPath = getSlicePath(0, ibVal);
    const companyPath = getSlicePath(ibVal, ibVal + companyVal);
    const investorPath = getSlicePath(ibVal + companyVal, 1.0);

    const [boundary1X, boundary1Y] = getCoordinatesForPercent(0);
    const [boundary2X, boundary2Y] = getCoordinatesForPercent(ibVal);
    const [boundary3X, boundary3Y] = getCoordinatesForPercent(ibVal + companyVal);

    // Dynamic positioning for labels inside the blue Investor slice
    const investorStart = ibVal + companyVal;
    const investorMid = (investorStart + 1.0) / 2;
    const [labelX, labelY] = getLabelCoordinates(investorMid, 0.55);

    // Calculate dates and values for the chart
    const chartValues = chartData.map(d => d.value ?? 0);
    const minVal = chartValues.length > 0 ? Math.min(...chartValues) : 0;
    const maxVal = chartValues.length > 0 ? Math.max(...chartValues) : 100;

    const points = chartData.map((d, i) => {
        const x = paddingLeft + (chartData.length > 1 ? (i / (chartData.length - 1)) * chartWidth : chartWidth / 2);
        const y = maxVal === minVal
            ? paddingTop + chartHeight / 2
            : paddingTop + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
        return { x, y, date: d.date, value: d.value };
    });

    const getSmoothLinePath = (pts) => {
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const cp1x = p1.x + (p2.x - p1.x) / 3;
            const cp1y = p1.y;
            const cp2x = p2.x - (p2.x - p1.x) / 3;
            const cp2y = p2.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return path;
    };

    const smoothLine = getSmoothLinePath(points);
    const smoothArea = points.length > 0
        ? `${smoothLine} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
        : '';

    const handleMouseMove = (e) => {
        if (points.length === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 500;
        
        let closestPoint = points[0];
        let minDiff = Math.abs(points[0].x - mouseX);
        for (let i = 1; i < points.length; i++) {
            const diff = Math.abs(points[i].x - mouseX);
            if (diff < minDiff) {
                minDiff = diff;
                closestPoint = points[i];
            }
        }
        setHoveredPoint(closestPoint);
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };
    return (
        <div className={styles.dashboardDetails}>
            <div className={styles.items}>
                <div className={styles.chartHeader}>
                    <h3>Portfolio Growth</h3>
                    <select
                        className={styles.timeframeSelect}
                        value={chartTimeframe}
                        onChange={(e) => setChartTimeframe(e.target.value)}
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                <div className={styles.chartContainer}>
                    {isChartLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <div className={styles.skeleton} style={{ width: '100%', height: '190px' }} />
                        </div>
                    ) : chartData.length === 0 ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888', fontSize: '14px' }}>
                            No portfolio growth data found
                        </div>
                    ) : (
                        <div
                            style={{ position: 'relative', width: '100%', height: '100%' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <svg viewBox="0 0 500 250" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1C61BA" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#1C61BA" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Y Gridlines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                    const y = paddingTop + ratio * chartHeight;
                                    return (
                                        <line
                                            key={`grid-${index}`}
                                            x1={paddingLeft}
                                            y1={y}
                                            x2={paddingLeft + chartWidth}
                                            y2={y}
                                            stroke="#F3F4F6"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                    );
                                })}

                                {/* Area fill under curve */}
                                {smoothArea && <path d={smoothArea} fill="url(#areaGradient)" />}

                                {/* Line path */}
                                {smoothLine && (
                                    <path
                                        d={smoothLine}
                                        fill="none"
                                        stroke="var(--Blue, #1C61BA)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                )}

                                {/* Tooltip Guide Line */}
                                {hoveredPoint && (
                                    <line
                                        x1={hoveredPoint.x}
                                        y1={paddingTop}
                                        x2={hoveredPoint.x}
                                        y2={paddingTop + chartHeight}
                                        stroke="#1C61BA"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                    />
                                )}

                                {/* Hover Dot */}
                                {hoveredPoint && (
                                    <circle
                                        cx={hoveredPoint.x}
                                        cy={hoveredPoint.y}
                                        r="6"
                                        fill="#1C61BA"
                                        stroke="#FFF"
                                        strokeWidth="2"
                                    />
                                )}

                                {/* X Axis Dates */}
                                {points.map((p, i) => {
                                    let labelInterval = 1;
                                    if (points.length > 15) {
                                        labelInterval = 5;
                                    } else if (points.length > 8) {
                                        labelInterval = 2;
                                    }
                                    
                                    if (i % labelInterval !== 0 && i !== points.length - 1) {
                                        return null;
                                    }
                                    
                                    return (
                                        <text
                                            key={`label-${i}`}
                                            x={p.x}
                                            y={235}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fontWeight="500"
                                            fill="#A0A0A0"
                                            fontFamily="Plus Jakarta Sans, sans-serif"
                                        >
                                            {formatLabelDate(p.date)}
                                        </text>
                                    );
                                })}
                            </svg>

                            {/* Hover Tooltip Overlay */}
                            {hoveredPoint && (
                                <div
                                    className={styles.tooltip}
                                    style={{
                                        left: `${(hoveredPoint.x / 500) * 100}%`,
                                        top: `${(hoveredPoint.y / 250) * 100}%`,
                                    }}
                                >
                                    <h5>{formatTooltipDate(hoveredPoint.date)}</h5>
                                    <p>${hoveredPoint.value ? hoveredPoint.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '0'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.items}>
                <div className={styles.twoCol}>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <DolorIcon />
                        </div>
                        <h3>Pending Withdraw Requests</h3>
                        {isMetricsLoading ? (
                            <span className={styles.skeleton} style={{ width: '80px', height: '32px', marginTop: '4px' }} />
                        ) : (
                            <p>{metrics?.pending_withdraw_requests ?? 0}</p>
                        )}
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <DolorIcon />
                        </div>
                        <h3>Completed Withdraw Requests</h3>
                        {isMetricsLoading ? (
                            <span className={styles.skeleton} style={{ width: '80px', height: '32px', marginTop: '4px' }} />
                        ) : (
                            <p>{metrics?.completed_withdraw_requests ?? 0}</p>
                        )}
                    </div>
                </div>
                <div className={styles.bottomSection}>
                    <div className={styles.sharingModelCard}>
                        <h3>Current Sharing Model</h3>
                        <div className={styles.chartContainer}>
                            {isSharingModelLoading ? (
                                <div className={styles.skeleton} style={{ width: '180px', height: '180px', borderRadius: '50%', marginBottom: '24px' }} />
                            ) : (
                                <svg viewBox="0 0 200 200" className={styles.pieChart}>
                                    <defs>
                                        <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
                                            <rect width="8" height="8" fill="#FFFFFF" />
                                            <path d="M0,4 h8" stroke="#C0C0C0" strokeWidth="1.5" />
                                        </pattern>
                                    </defs>
                                    
                                    {/* IB Slice (Light grey) */}
                                    <path d={ibPath} fill="#EAEAEA" />
                                    
                                    {/* Company Slice (Stripes pattern) */}
                                    <path d={companyPath} fill="url(#stripes)" />
                                    
                                    {/* Investor Slice (Solid Blue) */}
                                    <path d={investorPath} fill="var(--Blue, #1C61BA)" />
                                    
                                    {/* White borders between slices */}
                                    <line x1="100" y1="100" x2={boundary1X} y2={boundary1Y} stroke="#fff" strokeWidth="2.5" />
                                    <line x1="100" y1="100" x2={boundary2X} y2={boundary2Y} stroke="#fff" strokeWidth="2.5" />
                                    <line x1="100" y1="100" x2={boundary3X} y2={boundary3Y} stroke="#fff" strokeWidth="2.5" />
                                    
                                    {/* Dynamic labels centered inside the Investor slice */}
                                    <text x={labelX} y={labelY - 10} fill="#fff" textAnchor="middle" fontSize="15" fontWeight="500">Investor</text>
                                    <text x={labelX} y={labelY + 20} fill="#fff" textAnchor="middle" fontSize="28" fontWeight="700">{investorPct}%</text>
                                </svg>
                            )}
                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <span className={styles.blueSquare}></span> Investor {!isSharingModelLoading && `(${investorPct}%)`}
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.graySquare}></span> DP{!isSharingModelLoading && `(${ibPct}%)`}
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.blueSquare}></span> Company {!isSharingModelLoading && `(${companyPct}%)`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.transactionsCard}>
                        <h3>Recent Transactions</h3>
                        <div className={styles.transactionList}>
                            {isTransactionsLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div className={styles.transactionItem} key={`skeleton-${i}`}>
                                        <div className={styles.row}>
                                            <span className={styles.skeleton} style={{ width: '120px', height: '14px' }} />
                                            <span className={styles.skeleton} style={{ width: '60px', height: '14px' }} />
                                        </div>
                                        <div className={styles.row} style={{ marginTop: '4px' }}>
                                            <span className={styles.skeleton} style={{ width: '80px', height: '12px' }} />
                                            <span className={styles.skeleton} style={{ width: '50px', height: '12px' }} />
                                        </div>
                                        <div className={`${styles.row} ${styles.timeRow}`}>
                                            <span className={styles.skeleton} style={{ width: '70px', height: '11px' }} />
                                        </div>
                                    </div>
                                ))
                            ) : transactions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: '#888', fontSize: '14px' }}>
                                    No recent transactions found
                                </div>
                            ) : (
                                transactions.map((tx) => (
                                    <div className={styles.transactionItem} key={tx.id}>
                                        <div className={styles.row}>
                                            <h4>{tx.user_name || 'Anonymous'}</h4>
                                            <h4>${tx.amount ? tx.amount.toLocaleString() : '0'}</h4>
                                        </div>
                                        <div className={styles.row}>
                                            <span>#{tx.id ? tx.id.slice(0, 8) : ''}</span>
                                            <span>{formatTransactionType(tx.transaction_type)}</span>
                                        </div>
                                        <div className={`${styles.row} ${styles.timeRow}`}>
                                            <span className={styles.time}>{timeAgo(tx.created_at)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
