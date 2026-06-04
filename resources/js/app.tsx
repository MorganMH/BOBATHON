import '../scss/app.scss';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import AppLayout from './Layouts/AppLayout';

createInertiaApp({
    title: (title) => (title ? `${title} · Kathy Command Centre` : 'Kathy Command Centre'),
    resolve: async (name) => {
        const page: any = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        );
        // Wrap every page in the persistent Carbon UI Shell unless it opts out.
        page.default.layout =
            page.default.layout ?? ((p: ReactNode) => <AppLayout>{p}</AppLayout>);
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#0f62fe' },
});
