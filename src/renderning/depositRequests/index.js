import ActionHeader from '@/components/actionHeader'
import React from 'react'
import DepositRequestsTable from './depositRequestsTable'

export default function DepositRequests() {
    return (
        <div>
            <ActionHeader />
            <DepositRequestsTable />
        </div>
    )
}
