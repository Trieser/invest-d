import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';

function Tooltip({ children, text }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative flex items-center justify-center">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="flex items-center justify-center w-full h-full"
            >
                {children}
            </div>
            {show && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded-lg bg-gray-900 text-white text-xs shadow-lg whitespace-nowrap z-50 animate-fade-in">
                    {text}
                </div>
            )}
        </div>
    );
}

function Navbar({ auth }) {
    return (
        <nav
            className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-green-100 via-blue-50 to-green-50 shadow-md flex items-center z-40 transition-all duration-300 border-b border-green-100"
            style={{ paddingLeft: 104, paddingRight: 32 }} // 80px sidebar + 24px gap
        >
            <div className="flex items-center gap-2">
                <span className="text-2xl">📷</span>
                <span className="text-xl font-bold text-gray-800 tracking-wide">Photo Gallery</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
                <span className="text-gray-700 font-medium hidden sm:block">{auth?.user?.name}</span>
                <Tooltip text={auth?.user?.name || 'User'}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow border-2 border-white">
                        <span className="text-white font-bold text-base select-none">
                            {auth?.user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </Tooltip>
            </div>
        </nav>
    );
}

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