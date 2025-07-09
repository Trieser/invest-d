import React, { useState, useRef, useEffect } from 'react';

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
            className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-green-100 via-blue-50 to-green-50 shadow-md flex items-center z-40 transition-all duration-300 border-b border-green-100"
            style={{ paddingLeft: 104, paddingRight: 32 }}
        >
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">📷</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-800 tracking-wide">Photo Gallery</span>
                    <span className="text-xs text-gray-600 -mt-1">Capture & Share</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="ml-8 flex-1 max-w-md">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search photos, genres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200"
                    />
                    <button
                        type="submit"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                        🔍
                    </button>
                </form>
            </div>

            {/* User Menu */}
            <div className="ml-auto flex items-center gap-3 relative" ref={menuRef}>
                <span className="text-gray-700 font-medium hidden sm:block">{auth?.user?.name}</span>
                <button
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-sm focus:outline-none hover:shadow-lg hover:scale-110 transition-all duration-300 group"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <span className="text-white font-bold text-sm select-none group-hover:scale-110 transition-transform duration-300">
                        {auth?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className={`absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full transition-all duration-300 ${showMenu ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></span>
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-12 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transform transition-all duration-300 ease-out animate-fade-in scale-100 opacity-100">
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                        <a
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">👤</span> 
                            <span className="font-medium">Profile</span>
                        </a>
                        <button
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm group"
                            onClick={() => {}}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🌙</span> 
                            <span className="font-medium">Night Mode</span>
                        </button>
                        <button
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 text-sm group"
                            onClick={() => { window.location.href = '/logout'; }}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span> 
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
} 