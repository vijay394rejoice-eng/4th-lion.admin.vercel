import React from 'react';
import styles from './usersTable.module.scss';
import Pagination from '@/components/pagination';

export default function UsersTable() {
    // Generate 14 rows of user data to match the screenshot exactly
    const users = Array.from({ length: 14 }, (_, index) => ({
        id: index,
        dateJoined: "24-12-2026 | 10:12 PM",
        userId: "1234567",
        name: "Johnathan Doe",
        email: "examplemail@mail.com",
        partner: "Yes",
        profit: "$42,120.45"
    }));

    return (
        <>
            <div className={styles.usersTable}>
                <div className={styles.tableWrapper}>
                    {/* Floating Header Card */}
                    <div className={styles.headerCard}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th>Date Joined</th>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Partner</th>
                                    <th>Profit</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    {/* Floating Body Card containing stacked rows */}
                    <div className={styles.bodyCard}>
                        <table className={styles.table}>
                            <tbody className={styles.tbody}>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td >{user.dateJoined}</td>
                                        <td >{user.userId}</td>
                                        <td className={styles.name}>{user.name}</td>
                                        <td >{user.email}</td>
                                        <td >{user.partner}</td>
                                        <td className={styles.profit}>{user.profit}</td>
                                        <td>
                                            <button className={styles.viewBtn}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Pagination />
        </>
    );
}
