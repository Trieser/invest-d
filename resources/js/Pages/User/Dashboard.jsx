import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";

const backgroundUrl = "/images/landscape.jpg";
const natureQuotes = [
    "Nature always wears the colors of the spirit. – Ralph Waldo Emerson",
    "In every walk with nature, one receives far more than he seeks. – John Muir",
    "Look deep into nature, and then you will understand everything better. – Albert Einstein",
    "The earth has music for those who listen. – William Shakespeare",
    "Adopt the pace of nature: her secret is patience. – Ralph Waldo Emerson",
];

export default function UserDashboard({ auth, photoCount = 0 }) {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(natureQuotes[Math.floor(Math.random() * natureQuotes.length)]);
    }, []);

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    const goToPhotos = () => {
        Inertia.visit("/user/photos");
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
        <div
            className="min-h-screen flex flex-col relative overflow-hidden"
            style={{
                backgroundImage: `url('${backgroundUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none animate-gradient bg-gradient-to-br from-green-400/40 via-blue-400/30 to-yellow-200/30 backdrop-blur-sm"></div>
            {/* Static dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <nav className="relative z-10 bg-white/60 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900 drop-shadow">
                                {auth.user.name} Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 drop-shadow">
                                Welcome, {auth.user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-green-600 transition duration-200 shadow"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex-1 flex items-center justify-center">
                <div className="w-full max-w-3xl px-4">
                    <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10 animate-fade-in border border-white/30">
                        <h2 className="text-3xl font-extrabold text-green-900 mb-2 drop-shadow flex items-center gap-2">
                            <span>🌿</span> Welcome, {auth.user.name}!
                        </h2>
                        <p className="text-green-800 italic mb-6 text-lg transition-all duration-500">
                            “{quote}”
                        </p>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-blue-700 drop-shadow">{photoCount}</span>
                                <span className="text-xs text-gray-700">Your Photos</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-green-700 drop-shadow">🌱</span>
                                <span className="text-xs text-gray-700">Nature Points</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className="bg-blue-50/80 p-6 rounded-xl cursor-pointer hover:scale-105 hover:shadow-xl hover:bg-blue-100/80 transition-all duration-300 shadow flex flex-col items-center"
                                onClick={goToPhotos}
                            >
                                <div className="text-4xl mb-2 animate-bounce">📸</div>
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Photo Gallery
                                </h3>
                                <p className="text-blue-700 text-center">
                                    Upload and manage your nature photos
                                </p>
                                <p className="text-sm text-blue-600 mt-2">
                                    Drag & drop photos up to 11MB
                                </p>
                            </div>
                            <div className="bg-green-50/80 p-6 rounded-xl shadow flex flex-col items-center hover:scale-105 hover:shadow-xl hover:bg-green-100/80 transition-all duration-300">
                                <div className="text-4xl mb-2 animate-pulse">🌱</div>
                                <h3 className="text-lg font-semibold text-green-900">
                                    Activity
                                </h3>
                                <p className="text-green-700 text-center">
                                    View your recent activity and nature inspiration
                                </p>
                                <ul className="mt-2 text-green-800 text-sm list-disc list-inside text-left">
                                    <li>Upload your latest photos</li>
                                    <li>
                                        Explore other user galleries (coming soon)
                                    </li>
                                    <li>Get nature photography tips</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* CSS for fade-in and animated gradient */}
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 1.2s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradientMove 8s ease-in-out infinite;
                }
                @keyframes gradientMove {
                    0% {background-position: 0% 50%;}
                    50% {background-position: 100% 50%;}
                    100% {background-position: 0% 50%;}
                }
            `}</style>
        </div>
    );
}