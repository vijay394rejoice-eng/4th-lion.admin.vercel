import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import React from 'react'

export default function layout({ children }) {
    return (
        <div className='flex-box'>
            <div className='sidebar-layout'>
                <Sidebar />
            </div>
            <div className='children-layout'>
                <Header />
                <div className='children-layout-spacing'>
                    {children}
                </div>
            </div>
        </div>
    )
}
