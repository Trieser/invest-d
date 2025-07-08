import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Sidebar({ auth, sidebarOpen, setSidebarOpen, activeGenres = [], currentPage = 'photos', currentGenreId = null }) {
    const goBack = () => {
        Inertia.visit('/user/dashboard');
    };

    const goToPhotos = () => {
        Inertia.visit('/user/photos');
    };

    const goToGenres = () => {
        Inertia.visit('/user/genres');
    };

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-green-800">Photo DBMS</h1>
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="flex flex-col h-full">
                {/* User Info */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                            <p className="text-xs text-gray-500">User</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="space-y-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Navigation
                        </h3>
                        
                        <button
                            onClick={goBack}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                currentPage === 'dashboard' 
                                    ? 'text-green-700 bg-green-50' 
                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                        >
                            <span className="mr-3 text-lg">🏠</span>
                            Dashboard
                        </button>
                        
                        <button
                            onClick={goToPhotos}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                currentPage === 'photos' 
                                    ? 'text-green-700 bg-green-50' 
                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                        >
                            <span className="mr-3 text-lg">📸</span>
                            Input Photo
                        </button>
                        
                        <button
                            onClick={goToGenres}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                currentPage === 'genres' 
                                    ? 'text-green-700 bg-green-50' 
                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                        >
                            <span className="mr-3 text-lg">🏷️</span>
                            Genre
                        </button>
                    </div>

                    {/* Active Genres Section */}
                    {activeGenres.length > 0 && (
                        <div className="space-y-1 mt-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Active Genres
                            </h3>
                            <div className="space-y-1">
                                {activeGenres.map((genre) => (
                                    <button
                                        key={genre.id}
                                        onClick={() => Inertia.visit(`/user/photos/genre/${genre.id}`)}
                                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                            currentGenreId === genre.id
                                                ? 'text-green-700 bg-green-50 border border-green-200'
                                                : 'text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className="mr-2 text-lg">📷</span>
                                        <span className="font-medium">{genre.name}</span>
                                        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                                            currentGenreId === genre.id
                                                ? 'text-green-600 bg-green-200'
                                                : 'text-gray-500 bg-gray-200'
                                        }`}>
                                            {genre.photo_count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Logout */}
                <div className="px-4 py-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                        <span className="mr-3 text-lg">🚪</span>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
} 