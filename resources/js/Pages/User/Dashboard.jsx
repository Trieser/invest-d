import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import Sidebar from '../../Components/Sidebar';

const backgroundUrl = "/images/landscape.jpg";
const natureQuotes = [
    "Nature always wears the colors of the spirit. – Ralph Waldo Emerson",
    "In every walk with nature, one receives far more than he seeks. – John Muir",
    "Look deep into nature, and then you will understand everything better. – Albert Einstein",
    "The earth has music for those who listen. – William Shakespeare",
    "Adopt the pace of nature: her secret is patience. – Ralph Waldo Emerson",
];

export default function UserDashboard({ auth, photoCount = 0, activeGenres = [] }) {
    const [quote, setQuote] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setQuote(natureQuotes[Math.floor(Math.random() * natureQuotes.length)]);
    }, []);

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    const goToPhotos = () => {
        Inertia.visit("/user/photos");
    };

    const goToGenres = () => {
        Inertia.visit("/user/genres");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (!auth || !auth.user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Loading...
                    </h1>
                    <p className="text-gray-600">
                        Please wait while we load your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                auth={auth}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeGenres={activeGenres}
                currentPage="dashboard"
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome back, {auth.user.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 mb-8 border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-green-900 mb-2">
                                        Welcome, {auth.user.name}! 🌿
                                    </h1>
                                    <p className="text-green-800 italic text-lg mb-4">
                                        "{quote}"
                                    </p>
                                    <div className="flex items-center space-x-8">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">{photoCount}</div>
                                            <div className="text-sm text-gray-600">Total Photos</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">🌱</div>
                                            <div className="text-sm text-gray-600">Nature Points</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="text-6xl">📷</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div
                                onClick={goToPhotos}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <span className="text-2xl">📤</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
                                        <p className="text-gray-600 text-sm">Add new photos to your gallery</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={goToGenres}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <span className="text-2xl">🏷️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Manage Genres</h3>
                                        <p className="text-gray-600 text-sm">Add or remove photo genres</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Welcome to your photo management system!</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>You have {photoCount} photos in your gallery</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <span>Ready to organize your photos with genres</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}