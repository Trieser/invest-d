import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Sidebar({ auth, currentPage = 'photos', currentGenreId = null, activeGenres = [] }) {
    const menu = [
        { icon: '📸', page: 'photos', onClick: () => Inertia.visit('/user/photos'), label: 'Upload Photo' },
        { icon: '🏷️', page: 'genres', onClick: () => Inertia.visit('/user/genres'), label: 'Genres' },
    ];
    const genreMenus = activeGenres.map(genre => ({
        icon: '📷',
        page: `genre-${genre.id}`,
        onClick: () => Inertia.visit(`/user/photos/genre/${genre.id}`),
        badge: genre.photo_count,
        active: currentGenreId === genre.id,
        label: genre.name
    }));
    return (
        <aside className="fixed left-6 top-20 h-[calc(100vh-6rem)] w-20 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col z-50">
            {/* Logo Section */}
            <div className="flex flex-col items-center py-4 border-b border-gray-100">
                <button
                    className={`flex flex-col items-center w-full focus:outline-none ${currentPage === 'dashboard' ? 'font-bold text-blue-600' : ''}`}
                    onClick={() => Inertia.visit('/user/dashboard')}
                >
                    <span className="text-3xl">📷</span>
                    <span className="text-xs font-bold mt-1 tracking-tight">Gallery</span>
                </button>
            </div>
            {/* Main Navigation */}
            <nav className="flex-1 flex flex-col items-center gap-4 py-6 overflow-y-auto">
                {menu.map(item => (
                    <SidebarIcon
                        key={item.page}
                        icon={item.icon}
                        label={item.label}
                        active={currentPage === item.page}
                        onClick={item.onClick}
                    />
                ))}
                {genreMenus.length > 0 && (
                    <div className="w-10 h-px bg-gray-200 my-2"></div>
                )}
                {genreMenus.map(item => (
                    <SidebarIcon
                        key={item.page}
                        icon={item.icon}
                        label={item.label}
                        active={item.active}
                        onClick={item.onClick}
                        badge={item.badge}
                    />
                ))}
            </nav>
            {/* User Section */}
            <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-100">
                <button
                    onClick={() => Inertia.post('/logout')}
                    className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center focus:outline-none"
                >
                    <span className="text-2xl">🚪</span>
                </button>
                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                    {auth.user.name.charAt(0).toUpperCase()}
                </div>
            </div>
        </aside>
    );
}

function SidebarIcon({ icon, label, active, onClick, badge }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center w-full focus:outline-none ${active ? 'font-bold text-blue-600' : 'text-gray-700'}`}
        >
            <span className="text-2xl relative">
                {icon}
                {badge !== undefined && (
                    <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">{badge}</span>
                )}
            </span>
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
} 