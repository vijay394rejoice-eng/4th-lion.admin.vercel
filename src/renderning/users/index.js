import ActionHeader from '@/components/actionHeader'
import React from 'react'
import UsersTable from './usersTable'
import ApproveRequest from '@/components/approveRequest'

export default function Users() {
    return (
        <div>
            <ActionHeader />
            <UsersTable />
            {/* <ApproveRequest /> */}
        </div>
    )
}
