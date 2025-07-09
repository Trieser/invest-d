import React from 'react';

export default function View({ open, onClose, photo }) {
    if (!open || !photo) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-lg w-full relative animate-fade-in">
                <button
                    className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >×</button>
                <div className="flex flex-col items-center">
                    <img
                        src={photo.file_path}
                        alt={photo.original_name}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            width: 'auto',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto',
                            background: '#f6f6fa'
                        }}
                        onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                    />
                    <div className="mt-3 text-center">
                        <div className="font-semibold text-gray-900 text-base truncate">{photo.original_name}</div>
                        <div className="text-xs text-gray-500">{(photo.file_size / (1024 * 1024)).toFixed(2)} MB</div>
                        <div className="text-xs text-gray-400">{new Date(photo.created_at).toLocaleDateString('en-US')}</div>
                        {photo.description && (
                            <div className="text-sm text-gray-600 mt-2">{photo.description}</div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px);}
                    to { opacity: 1; transform: translateY(0);}
                }
            `}</style>
        </div>
    );
} 