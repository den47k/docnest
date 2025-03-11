import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CreateTeamModal } from './components/common/CreateTeamModal';
import { Toaster } from './components/ui/toaster';
import { ModalProvider } from './lib/contexts/ModalContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ModalProvider>
        <App {...props} />
        <CreateTeamModal />
        <Toaster />
      </ModalProvider>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});
