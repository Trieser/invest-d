import React, { useState, useRef, useMemo, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { motion, AnimatePresence } from "framer-motion";

function StarBackground({ count = 100 }) {
    const colors = ["#fff", "#b3e5fc", "#ffe082"];
    const stars = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => {
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                const size = Math.random() * 1.5 + 0.5; // Reduced size
                const duration = Math.random() * 3 + 4; // Slower animation
                const delay = Math.random() * 3;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const opacity = Math.random() * 0.3 + 0.3; // Lower opacity
                const moveX = Math.random() * 6 - 3; // Smaller movement
                const moveY = Math.random() * 6 - 3;
                return {
                    key: i,
                    top,
                    left,
                    size,
                    duration,
                    delay,
                    color,
                    opacity,
                    moveX,
                    moveY,
                };
            }),
        [count]
    );
    return (
        <div className="starry-bg">
            {stars.map((star) => (
                <motion.div
                    key={star.key}
                    className="star"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: star.size,
                        height: star.size,
                        background: star.color,
                        opacity: star.opacity,
                        position: "absolute",
                        borderRadius: "50%",
                    }}
                    animate={{
                        x: [0, star.moveX, 0],
                        y: [0, star.moveY, 0],
                        opacity: [
                            star.opacity,
                            star.opacity * 0.5,
                            star.opacity,
                        ],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

function ScrambleText({
    text,
    duration = 1200,
    scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
}) {
    const [display, setDisplay] = useState(text);
    useEffect(() => {
        let frame = 0;
        let revealed = Array(text.length).fill(false);
        let interval = setInterval(() => {
            let newText = text
                .split("")
                .map((char, i) => {
                    if (revealed[i]) return char;
                    if (Math.random() < frame / (duration / 15)) { // Slower reveal
                        revealed[i] = true;
                        return char;
                    }
                    return scrambleChars[
                        Math.floor(Math.random() * scrambleChars.length)
                    ];
                })
                .join("");
            setDisplay(newText);
            frame++;
            if (revealed.every(Boolean)) clearInterval(interval);
        }, 80); // Increased interval from 40ms to 80ms
        return () => clearInterval(interval);
    }, [text, duration, scrambleChars]);
    return <span style={{ color: '#FFE81F', fontFamily: 'Montserrat, Arial, sans-serif' }}>{display}</span>;
}

// Simplified blinking style for better performance
const blinkingStyle = `
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
`;

export default function Login({ errors }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const collapseTimeout = useRef(null);
    
    // Audio refs
    const hoverSoundRef = useRef(null);
    const clickSoundRef = useRef(null);
    const submitSoundRef = useRef(null);
    const lightsaberOnRef = useRef(null);
    const backgroundMusicRef = useRef(null);

    // Initialize audio on component mount
    useEffect(() => {
        // Create audio elements
        hoverSoundRef.current = new Audio('/audio/hover.mp3');
        clickSoundRef.current = new Audio('/audio/click.mp3');
        submitSoundRef.current = new Audio('/audio/submit.mp3');
        lightsaberOnRef.current = new Audio('/audio/Lightsaber On Sound HD.mp3');
        backgroundMusicRef.current = new Audio('/audio/Star Wars Main Theme (Full).mp3');
        
        // Set audio properties
        hoverSoundRef.current.volume = 0.4;
        clickSoundRef.current.volume = 0.5;
        submitSoundRef.current.volume = 0.6;
        lightsaberOnRef.current.volume = 0.6;
        backgroundMusicRef.current.volume = 0.3;
        backgroundMusicRef.current.loop = true;
        
        // Add event listeners for music
        backgroundMusicRef.current.addEventListener('play', () => setIsMusicPlaying(true));
        backgroundMusicRef.current.addEventListener('pause', () => setIsMusicPlaying(false));
        backgroundMusicRef.current.addEventListener('ended', () => setIsMusicPlaying(false));
        
        // Simple auto-play attempt (only once)
        const tryAutoPlay = async () => {
            try {
                await backgroundMusicRef.current.play();
                setIsMusicPlaying(true);
            } catch (error) {
                // Auto-play failed, that's okay
                setIsMusicPlaying(false);
            }
        };

        // Try auto-play once
        tryAutoPlay();

        // Simple interaction listener (only one attempt)
        const startMusicOnInteraction = async () => {
            if (!isMusicPlaying && backgroundMusicRef.current) {
                try {
                    await backgroundMusicRef.current.play();
                    setIsMusicPlaying(true);
                    
                    // Remove listeners after successful start
                    document.removeEventListener('click', startMusicOnInteraction);
                    document.removeEventListener('keydown', startMusicOnInteraction);
                    document.removeEventListener('touchstart', startMusicOnInteraction);
                } catch (error) {
                    // Failed, keep listeners active
                }
            }
        };

        // Add basic interaction listeners
        document.addEventListener('click', startMusicOnInteraction);
        document.addEventListener('keydown', startMusicOnInteraction);
        document.addEventListener('touchstart', startMusicOnInteraction);
        
        return () => {
            // Cleanup audio and listeners
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current = null;
            }
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
            document.removeEventListener('touchstart', startMusicOnInteraction);
        };
    }, []);

    // Play sound function
    const playSound = (audioRef) => {
        if (isSoundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Silent fail for sound effects
            });
        }
    };

    // Toggle sound function
    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
        if (backgroundMusicRef.current) {
            if (!isSoundEnabled) {
                backgroundMusicRef.current.play().catch(e => console.log('Background music play failed'));
            } else {
                backgroundMusicRef.current.pause();
            }
        }
    };

    // Toggle music function
    const toggleMusic = async () => {
        if (backgroundMusicRef.current) {
            try {
                if (isMusicPlaying) {
                    backgroundMusicRef.current.pause();
                    setIsMusicPlaying(false);
                } else {
                    await backgroundMusicRef.current.play();
                    setIsMusicPlaying(true);
                }
            } catch (error) {
                // Silent fail for music toggle
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        playSound(submitSoundRef);
        Inertia.post("/login", formData);
    };

    // Neon border style (simplified for better performance)
    const neonBorderStyle = {
        boxShadow: isExpanded
            ? "0 0 24px 6px #00fff7, 0 0 48px 12px #ff0059, 0 0 0 4px #0ff inset"
            : "0 0 12px 3px #00fff7, 0 0 24px 6px #ff0059, 0 0 0 2px #0ff inset",
        border: "2px solid transparent",
        background: "linear-gradient(120deg, #00fff7, #ff0059)",
        borderRadius: "1.5rem",
        zIndex: 2,
        transition: "box-shadow 0.3s ease",
    };

    // Auto-collapse logic with Star Wars sounds
    const handleHoverStart = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
        }
        // Only play lightsaber sound when transitioning from initial to expanded state
        if (!isExpanded) {
            playSound(lightsaberOnRef); // Lightsaber ignition sound
        }
        setIsExpanded(true);
    };
    
    const handleHoverEnd = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
        }
        collapseTimeout.current = setTimeout(() => {
            setIsExpanded(false);
            // Removed lightsaber off sound
        }, 3000);
    };
    
    const handleMouseEnter = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
        }
    };

    // Handle input focus with sound
    const handleInputFocus = () => {
        playSound(clickSoundRef);
    };

    return (
        <div className="min-h-screen flex bg-black font-sans relative overflow-hidden">
            <style>{blinkingStyle}</style>
            <StarBackground count={200} />
            
            {/* Audio Control Panel */}
            <div className="absolute top-4 right-4 z-30 flex flex-col space-y-2">
                {/* Start Music Button - Show when music is not playing */}
                {!isMusicPlaying && (
                    <motion.button
                        onClick={toggleMusic}
                        className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-2 border-yellow-300 transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ color: "#000" }}
                        title="Start Star Wars Music"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </motion.button>
                )}

                {/* Sound Toggle Button */}
                <motion.button
                    onClick={toggleSound}
                    className="p-3 rounded-full bg-[#181c23] border-2 border-cyan-500 hover:border-cyan-300 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ color: "#FFE81F" }}
                    title={isSoundEnabled ? "Disable Sound Effects" : "Enable Sound Effects"}
                >
                    {isSoundEnabled ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                    )}
                </motion.button>

                {/* Music Toggle Button - Show when music is playing */}
                {isMusicPlaying && (
                    <motion.button
                        onClick={toggleMusic}
                        className="p-3 rounded-full bg-[#181c23] border-2 border-cyan-500 hover:border-cyan-300 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ color: "#FFE81F" }}
                        title="Pause Music"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    </motion.button>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative z-20">
                {/* Music Status Indicator */}
                {!isMusicPlaying && (
                    <motion.div
                        className="absolute top-4 left-4 z-30 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span className="font-bold text-sm">Click anywhere to start Star Wars music!</span>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="relative"
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    onMouseEnter={handleMouseEnter}
                >
                    {/* Neon border always visible, glowing more when expanded, animated gradient */}
                    <motion.div
                        className="absolute inset-0 rounded-3xl pointer-events-none neon-animated-border"
                        style={neonBorderStyle}
                        animate={{
                            opacity: 1,
                            scale: isExpanded ? 1.02 : 1,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut",
                        }}
                    />
                    {/* Main card */}
                    <motion.div
                        className="relative z-10 bg-[#181c23] rounded-3xl shadow-2xl overflow-hidden"
                        style={{
                            fontFamily: "Montserrat, Arial, sans-serif",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                        }}
                        animate={{
                            width: isExpanded ? 400 : 300,
                            height: isExpanded ? 600 : 80,
                            scale: isExpanded ? 1.01 : 1,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                    >
                        {/* Initial state - just LOGIN text */}
                        <AnimatePresence>
                            {!isExpanded && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl font-extrabold tracking-widest drop-shadow-lg blinking-login" style={{fontFamily: 'Montserrat, Arial, sans-serif', color: '#FFE81F', animation: 'blink 1.2s infinite'}}>
                                        <ScrambleText text="FORCE LOGIN" />
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Expanded state - full form */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    className="p-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    {/* Brand/Logo with Star Wars theme */}
                                    <div className="mb-8 text-center">
                                        <motion.div
                                            className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center rounded-2xl shadow-lg mb-4 mx-auto"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.3,
                                            }}
                                        >
                                            {/* Star Wars inspired icon */}
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                                            </svg>
                                        </motion.div>
                                        <motion.h2
                                            className="text-2xl font-extrabold text-white mb-2 tracking-widest drop-shadow-lg"
                                            style={{
                                                fontFamily:
                                                    "Montserrat, Arial, sans-serif",
                                            }}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.4,
                                            }}
                                        >
                                            <ScrambleText text="Welcome" />
                                        </motion.h2>
                                        <motion.p
                                            className="text-cyan-200"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.5,
                                            }}
                                        >
                                            <ScrambleText text="May the Force be with you" />
                                        </motion.p>
                                    </div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <motion.div
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.6,
                                            }}
                                        >
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-bold text-cyan-100 mb-2 tracking-widest"
                                                style={{ color: "#FFE81F" }}
                                            >
                                                <ScrambleText text="Transmission Code" />
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={handleInputFocus}
                                                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-300 transition-all duration-300 bg-[#23272f] text-white placeholder-cyan-200 border-cyan-800 ${
                                                        errors?.email
                                                            ? "border-red-400 bg-red-50"
                                                            : "hover:border-cyan-300"
                                                    }`}
                                                    placeholder="Enter your transmission code"
                                                    required
                                                    style={{ color: "#FFE81F" }}
                                                />
                                            </div>
                                            {errors?.email && (
                                                <p className="mt-2 text-sm text-red-400">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.7,
                                            }}
                                        >
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-bold text-cyan-100 mb-2 tracking-widest"
                                                style={{ color: "#FFE81F" }}
                                            >
                                                <ScrambleText text="Force Password" />
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onFocus={handleInputFocus}
                                                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-300 transition-all duration-300 bg-[#23272f] text-white placeholder-cyan-200 border-cyan-800 ${
                                                        errors?.password
                                                            ? "border-red-400 bg-red-50"
                                                            : "hover:border-cyan-300"
                                                    }`}
                                                    placeholder="Enter your force password"
                                                    required
                                                    style={{ color: "#FFE81F" }}
                                                />
                                            </div>
                                            {errors?.password && (
                                                <p className="mt-2 text-sm text-red-400">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center justify-between"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.8,
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    id="remember"
                                                    name="remember"
                                                    type="checkbox"
                                                    checked={formData.remember}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-cyan-800 rounded bg-[#23272f]"
                                                />
                                                <label
                                                    htmlFor="remember"
                                                    className="ml-2 block text-sm text-cyan-100 tracking-widest"
                                                    style={{ color: "#FFE81F" }}
                                                >
                                                    <ScrambleText text="Remember Me" />
                                                </label>
                                            </div>
                                            <a
                                                href="#"
                                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest"
                                                style={{ color: "#FFE81F" }}
                                            >
                                                <ScrambleText text="Forgot force?" />
                                            </a>
                                        </motion.div>
                                        <motion.button
                                            type="submit"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.9,
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                boxShadow:
                                                    "0 0 24px 6px #00fff7, 0 0 48px 12px #ff0059",
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-extrabold py-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-300 text-lg tracking-widest"
                                            style={{
                                                color: "#000",
                                                borderColor: "#FFE81F",
                                            }}
                                        >
                                            <ScrambleText text="Activate Force" />
                                        </motion.button>
                                    </form>
                                    <motion.div
                                        className="mt-8 text-center"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 1.0,
                                        }}
                                    >
                                        <p
                                            className="text-sm text-cyan-200 tracking-widest"
                                            style={{ color: "#FFE81F" }}
                                        >
                                            <ScrambleText text="Not a Jedi yet?" />{" "}
                                            <a
                                                href="#"
                                                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                                                style={{ color: "#FFE81F" }}
                                            >
                                                <ScrambleText text="Join the Order" />
                                            </a>
                                        </p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

// Tambahkan animasi CSS di app.css:
// @keyframes neonmove {
//   0% { background-position: 0% 50%; }
//   100% { background-position: 100% 50%; }
// }
