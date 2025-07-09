import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import View from './View';

export default function PhotosByGenre({ photos, auth, activeGenres = [], genre }) {
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        <AppLayout auth={auth} sidebarProps={{activeGenres, currentPage: 'photos', currentGenreId: genre.id}}>
            <div className="bg-white border-b border-gray-200 px-6 py-6 rounded-xl mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{genre.name}</h1>
                <p className="text-sm text-gray-600 mb-2">{photos.length} photos in this genre</p>
            </div>
            {photos.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-gray-500">No photos in {genre.name} yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mobile-photo-grid">
                    {photos.map((photo) => (
                        <div key={photo.id} className="flex flex-col items-center bg-white rounded shadow-sm p-2 mobile-card">
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                                <img
                                    src={photo.file_path}
                                    alt={photo.original_name}
                                    className="object-cover w-full h-full max-h-60 mobile-photo-img"
                                    onClick={() => { setSelectedPhoto(photo); setShowViewModal(true); }}
                                    style={{ cursor: 'pointer' }}
                                    onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                                />
                            </div>
                            <div className="w-full text-center">
                                <div className="truncate text-sm font-medium text-gray-800 mobile-title">{photo.original_name}</div>
                                <div className="text-xs text-gray-500 mobile-photo-meta">{(photo.file_size / (1024 * 1024)).toFixed(2)} MB</div>
                                <div className="text-xs text-gray-400 mobile-photo-meta">{new Date(photo.created_at).toLocaleDateString('en-US')}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <View open={showViewModal} onClose={() => setShowViewModal(false)} photo={selectedPhoto} />
        </AppLayout>
    );
} 