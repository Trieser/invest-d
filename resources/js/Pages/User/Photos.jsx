import React, { useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Sidebar from '../../Components/Sidebar';

export default function Photos({ photos, auth, genres = [], activeGenres = [] }) {
    const [isDragging, setIsDragging] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);
    const [showGenreModal, setShowGenreModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [uploadingBatch, setUploadingBatch] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            setPendingFiles(prev => [...prev, ...files]);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            setPendingFiles(prev => [...prev, ...files]);
        }
    };

    const handleRemovePending = (idx) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSend = () => {
        setShowGenreModal(true);
    };

    const handleGenreSave = async () => {
        if (!selectedGenre) return;
        setUploadingBatch(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        let successCount = 0;
        for (let file of pendingFiles) {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('genre_id', selectedGenre);
            await fetch('/user/photos', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
            .then(response => response.json())
            .then(data => { if (data.success) successCount++; })
            .catch(() => {});
        }
        setUploadingBatch(false);
        setShowGenreModal(false);
        setPendingFiles([]);
        setSelectedGenre('');
        if (successCount > 0) Inertia.reload();
    };

    const handleDelete = (photoId) => {
        if (confirm('Are you sure you want to delete this photo?')) {
            fetch(`/user/photos/${photoId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Inertia.reload();
                } else {
                    alert('Failed to delete photo.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the photo.');
            });
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                auth={auth}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeGenres={activeGenres}
                currentPage="photos"
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
                            <h2 className="text-xl font-semibold text-gray-900">Photo Gallery</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {auth.user.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Upload Area */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📤</span> Upload New Photos
                                </h2>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        isDragging 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-4">
                                        <div className="text-5xl">🖼️</div>
                                        <div>
                                            <p className="text-base text-gray-600">
                                                Drag & drop your photos here or{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="text-blue-600 hover:text-blue-500 font-medium underline"
                                                >
                                                    choose files
                                                </button>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Max 11MB • JPG, PNG, GIF
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                                {/* Preview Pending Files */}
                                {pendingFiles.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold text-gray-800 mb-2">Pending Uploads:</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {pendingFiles.map((file, idx) => (
                                                <div key={idx} className="relative w-24 h-24 border rounded bg-gray-50 flex flex-col items-center justify-center overflow-hidden shadow">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <button
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                        onClick={() => handleRemovePending(idx)}
                                                        title="Remove"
                                                    >×</button>
                                                    <span className="text-xs text-gray-700 truncate w-full text-center mt-1">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 w-full"
                                            onClick={handleSend}
                                            disabled={pendingFiles.length === 0 || uploadingBatch}
                                        >
                                            Send
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Photos Grid */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    My Photos ({photos.length})
                                </h2>
                                {photos.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">📷</div>
                                        <p className="text-gray-500">No photos yet. Upload your first photo!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {photos.map((photo) => (
                                            <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                                                <div className="w-full h-40 flex items-center justify-center bg-white">
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.original_name}
                                                        className="max-w-full max-h-full object-contain"
                                                        style={{ background: '#fff', width: 'auto', height: 'auto', display: 'block' }}
                                                        onError={e => { e.target.src = '/images/placeholder.png'; }}
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {photo.original_name}
                                                    </h3>
                                                    <p className="text-xs text-green-700 mb-1">
                                                        {photo.genre?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {(photo.file_size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(photo.created_at).toLocaleDateString('en-US')}
                                                    </p>
                                                    {photo.description && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {photo.description}
                                                        </p>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(photo.id)}
                                                        className="mt-3 w-full bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

            {/* Genre Modal */}
            {showGenreModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs animate-fade-in">
                        <div className="flex flex-col items-center mb-4">
                            <span className="text-4xl mb-2">🏷️</span>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Select Genre</h3>
                            <p className="text-gray-600 text-sm mb-2 text-center">
                                Please select a genre for your photos before uploading.
                            </p>
                        </div>
                        <select
                            className="w-full border rounded px-2 py-2 mb-4"
                            value={selectedGenre}
                            onChange={e => setSelectedGenre(e.target.value)}
                        >
                            <option value="">-- Select Genre --</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                onClick={handleGenreSave}
                                disabled={!selectedGenre || uploadingBatch}
                            >
                                {uploadingBatch ? 'Uploading...' : 'Save & Upload'}
                            </button>
                            <button
                                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                                onClick={() => setShowGenreModal(false)}
                                disabled={uploadingBatch}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <style>{`
                        .animate-fade-in {
                            animation: fadeIn 0.7s;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(30px);}
                            to { opacity: 1; transform: translateY(0);}
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}