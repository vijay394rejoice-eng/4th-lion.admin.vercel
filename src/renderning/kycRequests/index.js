import ActionHeader from '@/components/actionHeader'
import React from 'react'
import KycRequestsTable from './kycRequestsTable'
import WithdrawRequestsCard from '../withdrawRequests/withdrawRequestsCard'
import UserInformation from '@/components/userInformation'
import UserInformationEdit from '@/components/userInformationEdit'
import LogoutModal from '@/components/logoutModal'
import KycPreview from '@/components/kycPreview'
import AddNewSubAdmin from '@/components/addNewSubAdmin'

export default function KycRequests() {
    return (
        <div>
            <WithdrawRequestsCard />
            <ActionHeader />
            <KycRequestsTable />
            {/* <UserInformation/> */}
            {/* <UserInformationEdit /> */}
            {/* <LogoutModal /> */}
            {/* <KycPreview /> */}
            <AddNewSubAdmin />
        </div>
    )
}
