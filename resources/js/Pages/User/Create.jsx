import React from 'react';

export default function Create({ show, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative border border-gray-700 shadow-xl">
                <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
} 