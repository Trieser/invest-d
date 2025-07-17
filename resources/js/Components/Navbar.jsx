import React, { useState, useRef, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Navbar({ auth }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    // Hide menu on click outside
    useEffect(() => {
        if (!showMenu) return;
        function handle(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }
        window.addEventListener('mousedown', handle);
        return () => window.removeEventListener('mousedown', handle);
    }, [showMenu]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            console.log('Searching for:', searchQuery);
            setSearchQuery('');
        }
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 shadow-md z-40 transition-all duration-300 border-b border-gray-700"
        >
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between w-full px-4 sm:px-8 py-2 sm:py-0 h-auto sm:h-16 gap-2 sm:gap-0">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-slate-800 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">💸</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-bold text-white tracking-wide">invest-d</span>
                    <span className="text-xs text-gray-400 -mt-1">Investment Dashboard</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-auto flex-1 max-w-xs sm:max-w-md mt-2 sm:mt-0">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search investments, stocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                        type="submit"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                        🔍
                    </button>
                </form>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 relative w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0" ref={menuRef}>
                <span className="text-gray-300 font-medium hidden sm:block">{auth?.user?.name}</span>
                <button
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-slate-800 flex items-center justify-center shadow-sm focus:outline-none hover:shadow-lg hover:scale-110 transition-all duration-300 group text-lg sm:text-base"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <span className="text-white font-bold text-base select-none group-hover:scale-110 transition-transform duration-300">
                        {auth?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className={`absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full transition-all duration-300 ${showMenu ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></span>
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-12 w-44 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 z-50 transform transition-all duration-300 ease-out animate-fade-in scale-100 opacity-100">
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-800 border-l border-t border-gray-700 transform rotate-45"></div>
                        <a
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 text-sm group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">👤</span> 
                            <span className="font-medium">Profile</span>
                        </a>
                        <button
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 text-sm group"
                            onClick={() => {}}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🌙</span> 
                            <span className="font-medium">Night Mode</span>
                        </button>
                        <button
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-red-900 hover:text-red-300 transition-all duration-200 text-sm group"
                            onClick={() => { Inertia.post('/logout'); }}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span> 
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
        </nav>
    );
} 