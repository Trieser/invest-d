import React from "react";

export default function FullScreenProgressLoader({ progress }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-64 h-4 bg-white/30 rounded-full overflow-hidden mb-4 shadow-lg">
                <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="text-white text-lg font-bold mb-2 animate-fade-in">
                Loading... {Math.round(progress)}%
            </div>
            <p className="text-green-100 animate-fade-in-slow">Preparing your nature dashboard 🌿</p>
            <style>{`
                .animate-fade-in { animation: fadeIn 1s; }
                .animate-fade-in-slow { animation: fadeIn 2s; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
}