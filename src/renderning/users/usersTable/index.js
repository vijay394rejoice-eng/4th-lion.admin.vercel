'use client'
import React from 'react';
import styles from './usersTable.module.scss';
import DataTable from '@/components/dataTable';

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

    const columns = [
        { header: "Date Joined", accessor: "dateJoined", width: "22%" },
        { header: "User ID", accessor: "userId", width: "12%" },
        { header: "Name", accessor: "name", width: "16%", className: styles.name },
        { header: "Email", accessor: "email", width: "22%" },
        { header: "Partner", accessor: "partner", width: "10%" },
        { header: "Profit", accessor: "profit", width: "10%", className: styles.profit },
        { 
            header: "Action", 
            width: "8%", 
            cell: (row) => (
                <button className={styles.viewBtn}>
                    View
                </button>
            ) 
        }
    ];

    return (
        <DataTable columns={columns} data={users} pageSize={10} />
    );
}
