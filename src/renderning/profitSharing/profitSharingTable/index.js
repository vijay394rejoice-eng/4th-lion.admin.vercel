'use client'
import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './profitSharingTable.module.scss';
import PlusIcon from '@/svg/plusIcon';
import MinusIcon from '@/svg/minusIcon';
import Pagination from '@/components/pagination';

const tableData = [
    {
        id: 1,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: [
            {
                id: 11,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
                children: []
            },
            {
                id: 12,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
                children: []
            },
            {
                id: 13,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
                children: [
                    {
                        id: 131,
                        date: '24-12-2026 | 10:12 PM',
                        name: 'Virat Kohli',
                        email: 'mail@mail.com',
                        profit: '$100',
                        commission: '$10',
                    },
                    {
                        id: 132,
                        date: '24-12-2026 | 10:12 PM',
                        name: 'Virat Kohli',
                        email: 'mail@mail.com',
                        profit: '$100',
                        commission: '$10',
                    }
                ]
            },
            {
                id: 14,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
            },
            {
                id: 15,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
            },
            {
                id: 16,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
            },
            {
                id: 17,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
            },
            {
                id: 18,
                date: '24-12-2026 | 10:12 PM',
                name: 'Virat Kohli',
                email: 'mail@mail.com',
                profit: '$100',
                commission: '$10',
            }
        ]
    },
    {
        id: 2,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 3,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 4,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 5,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 6,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 7,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 8,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    },
    {
        id: 9,
        date: '24-12-2026 | 10:12 PM',
        name: 'Virat Kohli',
        email: 'mail@mail.com',
        profit: '$100',
        commission: '$10',
        children: []
    }
];

const ColGroup = () => (
    <colgroup>
        <col style={{ width: '25%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '10%' }} />
    </colgroup>
);

const TableRow = ({ row, level = 0, isLast = false }) => {
    const [isOpen, setIsOpen] = useState(level === 0 && row.id === 1); // default open first for demo
    const hasChildren = row.children && row.children.length > 0;

    // Indentation configuration
    const INDENT_STEP = 24;
    const paddingLeft = level === 0 ? 24 : 24 + level * INDENT_STEP;

    return (
        <Fragment>
            <tr>
                <td style={{ paddingLeft: paddingLeft }}>
                    <div className={styles.firstCol}>
                        {level > 0 && (
                            <>
                                {/* Horizontal line pointing to this item */}
                                <div
                                    className={styles.horizontalLine}
                                    style={{
                                        left: -13,
                                        width: 13
                                    }}
                                />
                            </>
                        )}

                        {hasChildren && (
                            <div
                                className={styles.iconBox}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <MinusIcon /> : <PlusIcon />}
                            </div>
                        )}
                        <span>{row.date}</span>
                    </div>
                </td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.profit}</td>
                <td>{row.commission}</td>
                <td>
                    <button className={styles.actionBtn}>View</button>
                </td>
            </tr>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <tr>
                        <td colSpan={6} style={{ padding: 0, border: 'none' }}>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden', position: 'relative' }}
                            >
                                {/* Vertical line connecting children */}
                                <div
                                    className={styles.verticalLine}
                                    style={{
                                        left: paddingLeft + 11, // center of the icon box (width 24, so half is 12, minus 1px line width)
                                        top: -16,
                                        bottom: 24 // Don't go all the way down to avoid hanging line
                                    }}
                                />
                                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                                    <ColGroup />
                                    <tbody>
                                        {row.children.map((child, index) => (
                                            <TableRow
                                                key={child.id}
                                                row={child}
                                                level={level + 1}
                                                isLast={index === row.children.length - 1}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </Fragment>
    );
};

export default function ProfitSharingTable() {
    return (
        <>
            <div className={styles.tableContainer}>
                <table>
                    <ColGroup />
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Profit</th>
                            <th>Commission</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(row => (
                            <TableRow key={row.id} row={row} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination />
        </>
    );
}
