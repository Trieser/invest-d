import React from "react";

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
   return (
    <div className="bg-gradient-to-r from-gray-900/80 to-slate-800/80 rounded-xl shadow-sm border border-gray-700/50 p-1 mb-8 backdrop-blur-sm">
            <div className="flex space-x-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? "bg-gray-800 text-white border border-gray-500"
                                : "text-gray-300 hover:text-white hover:bg-gray-800"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
   )
}