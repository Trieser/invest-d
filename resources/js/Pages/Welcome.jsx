import React from 'react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to Laravel + Inertia + React
                </h1>
                <p className="text-gray-600">
                    Your application is now running with React 18 and Inertia.js!
                </p>
            </div>
        </div>
    );
} 