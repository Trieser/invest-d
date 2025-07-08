import './bootstrap';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import FullScreenProgressLoader from './Components/FullScreenProgressLoader';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        function MainApp() {
            const [progress, setProgress] = useState(0);
            const [loading, setLoading] = useState(false);

            React.useEffect(() => {
                const start = () => {
                    setLoading(true);
                    setProgress(0);
                    // Simulasi progress naik
                    let val = 0;
                    const interval = setInterval(() => {
                        val += Math.random() * 20;
                        setProgress(p => {
                            if (p >= 90) return p; // stop at 90% until finish
                            return Math.min(90, val);
                        });
                    }, 120);
                    window._progressInterval = interval;
                };
                const finish = () => {
                    setProgress(100);
                    setTimeout(() => {
                        setLoading(false);
                        setProgress(0);
                        clearInterval(window._progressInterval);
                    }, 400);
                };

                Inertia.on('start', start);
                Inertia.on('finish', finish);

                return () => {
                    Inertia.off('start', start);
                    Inertia.off('finish', finish);
                    clearInterval(window._progressInterval);
                };
            }, []);

            return (
                <>
                    {loading && <FullScreenProgressLoader progress={progress} />}
                    <App {...props} />
                </>
            );
        }

        const root = ReactDOM.createRoot(el);
        root.render(<MainApp />);
    },
});