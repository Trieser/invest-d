import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Sidebar from '../../Components/Sidebar';

export default function PhotosByGenre({ photos, auth, activeGenres = [], genre }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar 
                auth={auth}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeGenres={activeGenres}
                currentPage="photos"
                currentGenreId={genre.id}
            />
            <div className="flex-1 flex flex-col lg:ml-0">
                <div className="bg-white border-b border-gray-200 px-6 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{genre.name}</h1>
                    <p className="text-sm text-gray-600 mb-2">{photos.length} photos in this genre</p>
                </div>
                <main className="flex-1 p-4">
                    {photos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📷</div>
                            <p className="text-gray-500">No photos in {genre.name} yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {photos.map((photo) => (
                                <div key={photo.id} className="flex flex-col items-center bg-white rounded shadow-sm p-2">
                                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                                        <img
                                            src={photo.url}
                                            alt={photo.original_name}
                                            className="object-cover w-full h-full max-h-60"
                                            onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                                        />
                                    </div>
                                    <div className="w-full text-center">
                                        <div className="truncate text-sm font-medium text-gray-800">{photo.original_name}</div>
                                        <div className="text-xs text-gray-500">{(photo.file_size / (1024 * 1024)).toFixed(2)} MB</div>
                                        <div className="text-xs text-gray-400">{new Date(photo.created_at).toLocaleDateString('en-US')}</div>
                                        <div className="text-xs text-red-500 break-all mt-1">{photo.url}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
} 