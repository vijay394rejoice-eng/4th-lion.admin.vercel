'use client';
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { hasRoutePermission } from '@/utils/permissions';
import { getMe } from '@/services/auth';

export default function Layout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedRole = localStorage.getItem('user_role');
        const savedPermissions = localStorage.getItem('permissions');
        
        if (savedRole) setRole(savedRole);
        if (savedPermissions) {
            try {
                setPermissions(JSON.parse(savedPermissions));
            } catch (e) {
                console.error("Failed to parse permissions:", e);
            }
        }

        const fetchLatestProfile = async () => {
            try {
                const res = await getMe();
                if (res && res.status === 1) {
                    const userData = res.data;
                    setRole(userData.role || '');
                    setPermissions(userData.permissions || []);
                    localStorage.setItem('user_role', userData.role || '');
                    localStorage.setItem('permissions', JSON.stringify(userData.permissions || []));
                }
            } catch (err) {
                console.error("Failed to fetch fresh user profile:", err);
            }
        };

        fetchLatestProfile();
    }, []);

    const isAuthorized = !isMounted || hasRoutePermission(pathname, role, permissions);

    return (
        <div className='flex-box'>
            <div 
                className="sidebar-overlay" 
                onClick={(e) => {
                    // Simple Vanilla JS to close sidebar
                    document.querySelector('.sidebar-layout')?.classList.remove('active');
                    e.target.classList.remove('active');
                }}
            ></div>
            <div className='sidebar-layout'>
                <Sidebar />
            </div>
            <div className='children-layout'>
                <Header />
                <div className='children-layout-spacing'>
                    {isAuthorized ? (
                        children
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '60vh',
                            textAlign: 'center',
                            padding: '40px 20px',
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                            margin: '20px',
                            border: '1px solid rgba(0, 0, 0, 0.08)'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#1E293B',
                                marginBottom: '12px',
                                letterSpacing: '-0.5px'
                            }}>
                                Access Denied
                            </h2>
                            
                            <p style={{
                                fontSize: '15px',
                                color: '#64748B',
                                maxWidth: '420px',
                                lineHeight: '1.6',
                                marginBottom: '28px'
                            }}>
                                You do not have the required permissions to view this section. If you believe this is an error, please contact your administrator.
                            </p>
                            
                            <button 
                                onClick={() => router.push('/dashboard')}
                                style={{
                                    padding: '12px 24px',
                                    background: '#1C61BA',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(28, 97, 186, 0.2)'
                                }}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
