import React from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

export default function AppLayout({ children, auth, sidebarProps = {} }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                {...sidebarProps}
                auth={auth}
            />
            {/* Navbar */}
            <Navbar auth={auth} />
            {/* Main Content */}
            <main
                className="transition-all duration-300 pt-16"
                style={{ marginLeft: 88, minHeight: 'calc(100vh - 4rem)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 