import React, { useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Photos({ photos, auth }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState('');
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
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = (file) => {
        // Validate file size (11MB = 11 * 1024 * 1024 bytes)
        const maxSize = 11 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File terlalu besar! Maksimal 11MB.');
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('Tipe file tidak didukung! Gunakan JPG, PNG, atau GIF.');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('description', description);

        fetch('/user/photos', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setDescription('');
                // Reload page to show new photo
                Inertia.reload();
            } else {
                alert('Upload gagal: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat upload.');
        })
        .finally(() => {
            setUploading(false);
        });
    };

    const handleDelete = (photoId) => {
        if (confirm('Yakin ingin menghapus foto ini?')) {
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
                    alert('Gagal menghapus foto.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menghapus foto.');
            });
        }
    };

    const goBack = () => {
        Inertia.visit('/user/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={goBack}
                                className="mr-4 text-gray-600 hover:text-gray-900"
                            >
                                ← Kembali
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Galeri Foto
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                {auth.user.name}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Upload Area */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Upload Foto Baru
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
                                <div className="text-6xl">📸</div>
                                <div>
                                    <p className="text-lg text-gray-600">
                                        Drag & drop foto di sini atau{' '}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            pilih file
                                        </button>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Maksimal 11MB • JPG, PNG, GIF
                                    </p>
                                </div>
                            </div>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {uploading && (
                            <div className="mt-4 text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Photos Grid */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Foto Saya ({photos.length})
                        </h2>
                        
                        {photos.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📷</div>
                                <p className="text-gray-500">Belum ada foto. Upload foto pertama Anda!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden">
                                        <div className="aspect-w-1 aspect-h-1">
                                            <img
                                                src={photo.url}
                                                alt={photo.original_name}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {photo.original_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {photo.get_file_size_in_mb} MB
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(photo.created_at).toLocaleDateString('id-ID')}
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
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 