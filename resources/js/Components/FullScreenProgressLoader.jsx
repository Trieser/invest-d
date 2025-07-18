import React from "react";

export default function FullScreenProgressLoader({ progress }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
            {/* Simple Star Background */}
            <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                    />
                ))}
            </div>
            
            {/* Progress Bar */}
            <div className="relative z-10 w-72 h-4 bg-gray-800/50 rounded-full overflow-hidden mb-6 shadow-lg border border-yellow-400/20">
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            {/* Loading Text */}
            <div className="text-yellow-400 text-xl font-bold mb-3 tracking-wider" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                INITIALIZING FORCE... {Math.round(progress)}%
            </div>
            
            {/* Star Wars Message */}
            <p className="text-yellow-300 text-sm tracking-wide" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                Preparing your Jedi dashboard
            </p>
            
            <style>{`
                @keyframes fadeIn { 
                    from { opacity: 0; transform: translateY(10px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
            `}</style>
        </div>
    );
}