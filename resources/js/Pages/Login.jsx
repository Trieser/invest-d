import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ errors }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    // Slider logic
    const images = [
        '/images/landscape.jpg',
        '/images/landscape2.jpg',
        '/images/landscape3.jpg',
        '/images/landscape4.jpg',
        '/images/landscape5.jpg',
    ];
    const [currentImage, setCurrentImage] = useState(0);
    const [direction, setDirection] = useState(1); // 1: next, -1: prev
    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1);
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/login', formData);
    };

    // Framer Motion variants for slider
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans">
            {/* Left: Image slider section (hidden on mobile) */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={images[currentImage]}
                        src={images[currentImage]}
                        alt={`Landscape ${currentImage + 1}`}
                        className="w-full h-full object-cover object-center absolute top-0 left-0"
                        style={{ minHeight: '100vh' }}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 60, damping: 20 }, opacity: { duration: 0.5 } }}
                    />
                </AnimatePresence>
                {/* Slider indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentImage ? 1 : -1);
                                setCurrentImage(idx);
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 border border-white ${
                                idx === currentImage ? 'bg-yellow-300 scale-125 shadow' : 'bg-white/60 hover:bg-yellow-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Login form */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 lg:px-16 bg-white min-h-screen">
                {/* Brand/Logo */}
                <div className="mb-8 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-yellow-300 flex items-center justify-center rounded-full shadow-md mb-2 animate-fade-in">
                        {/* Camera icon */}
                        <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-wide text-gray-900">PhotoApp</span>
                </div>
                <div className="w-full max-w-md mx-auto">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Access to PhotoApp</h2>
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-200 transition-all duration-200 bg-gray-50 text-gray-900 font-medium shadow-sm ${
                                        errors?.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-yellow-200'
                                    }`}
                                    placeholder="Insert email"
                                    required
                                />
                            </div>
                            {errors?.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-200 transition-all duration-200 bg-gray-50 text-gray-900 font-medium shadow-sm ${
                                        errors?.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-yellow-200'
                                    }`}
                                    placeholder="Your password"
                                    required
                                />
                            </div>
                            {errors?.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded transition-all duration-200"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-gray-600 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(251, 191, 36, 0.18)' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 text-lg"
                        >
                            Login
                        </motion.button>
                    </form>
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-700">
                            New to PhotoApp?{' '}
                            <a href="#" className="underline font-medium text-gray-900 hover:text-yellow-600">
                                Create an account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}