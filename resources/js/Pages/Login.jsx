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
                const size = Math.random() * 2.2 + 0.8;
                const duration = Math.random() * 2 + 2.5;
                const delay = Math.random() * 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const opacity = Math.random() * 0.5 + 0.5;
                const moveX = Math.random() * 10 - 5;
                const moveY = Math.random() * 10 - 5;
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
                            star.opacity * 0.7,
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
                    if (Math.random() < frame / (duration / 10)) {
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
        }, 40);
        return () => clearInterval(interval);
    }, [text, duration, scrambleChars]);
    return <span style={{ color: '#FFE81F', fontFamily: 'Montserrat, Arial, sans-serif' }}>{display}</span>;
}

// 1. Tambahkan style blinking di atas komponen (atau gunakan style jsx/global)
const blinkingStyle = `
@keyframes blink {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px #ea3711); }
  50% { opacity: 0.55; filter: drop-shadow(0 0 12px #FFE81F); }
}
@keyframes border-blink {
  0%, 100% { box-shadow: 0 0 12px 2px #00fff7, 0 0 24px 4px #00fff7, 0 0 0 3px #FFE81F inset; }
  50% { box-shadow: 0 0 18px 4px #ea3711, 0 0 32px 8px #ea3711, 0 0 0 6px #FFE81F inset; }
}
`;

export default function Login({ errors }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const collapseTimeout = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post("/login", formData);
    };

    // Neon border style (animated gradient + blinking)
    const neonBorderStyle = {
        boxShadow: isExpanded
            ? "0 0 32px 8px #00fff7, 0 0 64px 16px #ff0059, 0 0 0 6px #0ff inset"
            : "0 0 16px 4px #00fff7, 0 0 32px 8px #ff0059, 0 0 0 3px #0ff inset",
        border: "2.5px solid transparent",
        background: "linear-gradient(120deg, #00fff7, #ff0059, #00fff7 80%)",
        backgroundSize: "200% 200%",
        backgroundPosition: isExpanded ? "100% 0%" : "0% 100%",
        borderRadius: "1.5rem",
        zIndex: 2,
        transition: "box-shadow 0.4s, border 0.4s, background-position 2s",
        animation: isExpanded ? "neonmove 3s linear infinite, border-blink 1.6s ease-in-out infinite" : "border-blink 1.6s ease-in-out infinite",
    };

    // Auto-collapse logic
    const handleHoverStart = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
        }
        setIsExpanded(true);
    };
    const handleHoverEnd = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
        }
        collapseTimeout.current = setTimeout(() => {
            setIsExpanded(false);
        }, 3000);
    };
    const handleMouseEnter = () => {
        if (collapseTimeout.current) {
            clearTimeout(collapseTimeout.current);
        }
    };

    return (
        <div className="min-h-screen flex bg-black font-sans relative overflow-hidden">
            <style>{blinkingStyle}</style>
            <StarBackground count={1000} />
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative z-20">
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
                            filter: isExpanded ? "blur(0.5px)" : "blur(0.2px)",
                            scale: isExpanded ? 1.03 : 1,
                        }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 80,
                            damping: 18,
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
                            scale: isExpanded ? 1.03 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 18,
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
                                        <ScrambleText text="LOGIN" />
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
                                    {/* Brand/Logo */}
                                    <div className="mb-8 text-center">
                                        <motion.div
                                            className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center rounded-2xl shadow-lg mb-4 mx-auto"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.3,
                                            }}
                                        >
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                            <ScrambleText text="Welcome Back" />
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
                                            <ScrambleText text="Sign in to your account" />
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
                                                <ScrambleText text="Email Address" />
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
                                                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-300 transition-all duration-300 bg-[#23272f] text-white placeholder-cyan-200 border-cyan-800 ${
                                                        errors?.email
                                                            ? "border-red-400 bg-red-50"
                                                            : "hover:border-cyan-300"
                                                    }`}
                                                    placeholder="Enter your email"
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
                                                <ScrambleText text="Password" />
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
                                                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-300 transition-all duration-300 bg-[#23272f] text-white placeholder-cyan-200 border-cyan-800 ${
                                                        errors?.password
                                                            ? "border-red-400 bg-red-50"
                                                            : "hover:border-cyan-300"
                                                    }`}
                                                    placeholder="Enter your password"
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
                                                    <ScrambleText text="Remember me" />
                                                </label>
                                            </div>
                                            <a
                                                href="#"
                                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest"
                                                style={{ color: "#FFE81F" }}
                                            >
                                                <ScrambleText text="Forgot password?" />
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
                                            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-extrabold py-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-300 text-lg tracking-widest"
                                            style={{
                                                color: "#FFE81F",
                                                borderColor: "#FFE81F",
                                            }}
                                        >
                                            <ScrambleText text="Sign In" />
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
                                            <ScrambleText text="Don't have an account?" />{" "}
                                            <a
                                                href="#"
                                                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                                                style={{ color: "#FFE81F" }}
                                            >
                                                <ScrambleText text="Sign up" />
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
