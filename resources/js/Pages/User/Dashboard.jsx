import React, { useEffect, useState } from "react";
import AppLayout from '../../Layouts/AppLayout';

const backgroundUrl = "/images/landscape.jpg";
const investmentQuotes = [
    "The best investment you can make is in yourself. – Warren Buffett",
    "Investing should be more like watching paint dry or watching grass grow. – Paul Samuelson",
    "The stock market is a device for transferring money from the impatient to the patient. – Warren Buffett",
    "Risk comes from not knowing what you're doing. – Warren Buffett",
    "Time is your friend; impulse is your enemy. – John Bogle",
];

export default function UserDashboard({ auth, user }) {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(investmentQuotes[Math.floor(Math.random() * investmentQuotes.length)]);
    }, []);

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
        <AppLayout auth={auth}> 
            {/* Welcome Card */}
            <div className="relative rounded-xl p-8 mb-8 border border-blue-100 overflow-hidden" style={{background: `url(${backgroundUrl}) center/cover no-repeat`}}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-white bg-opacity-70 z-0"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 mb-2">
                            Welcome, {auth.user.name}! 💰
                        </h1>
                        <p className="text-blue-800 italic text-lg mb-4">
                            "{quote}"
                        </p>
                        <div className="flex items-center space-x-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">$0</div>
                                <div className="text-sm text-gray-600">Total Portfolio</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">📈</div>
                                <div className="text-sm text-gray-600">Investments</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-6xl">💼</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <span className="text-2xl">➕</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Add Investment</h3>
                            <p className="text-gray-600 text-sm">Record a new investment</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">View Portfolio</h3>
                            <p className="text-gray-600 text-sm">Check your investment performance</p>
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
                        <span>Welcome to your investment management system!</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Ready to start tracking your investments</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Add your first investment to get started</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}