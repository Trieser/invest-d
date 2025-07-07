import './bootstrap';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import React from 'react';
import ReactDOM from 'react-dom/client';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = ReactDOM.createRoot(el);
        root.render(<App {...props} />);
    },
});

InertiaProgress.init();
