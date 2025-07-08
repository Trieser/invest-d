import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function UserDashboard({ auth }) {
    const handleLogout = () => {
        Inertia.post('/logout');
    };

    const goToPhotos = () => {
        Inertia.visit('/user/photos');
    };

    // Handle case when auth is not available
    if (!auth || !auth.user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Loading...
                    </h1>
                    <p className="text-gray-600">
                        Memuat data pengguna...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {auth.user.name} Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Welcome, {auth.user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Dashboard {auth.user.name}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            This is the user dashboard. You can access the features available for users.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-200" onClick={goToPhotos}>
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">📸 Photo Gallery</h3>
                                <p className="text-blue-700">Upload and manage your photos</p>
                                <p className="text-sm text-blue-600 mt-2">Drag & drop photos up to 11MB</p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-900">📊 Activity</h3>
                                <p className="text-green-700">View your recent activity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}