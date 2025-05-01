import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CreateTeamModal } from './components/features/teams/CreateTeamModal';
import { Toaster } from './components/ui/toaster';
import { ModalProvider } from './lib/contexts/ModalContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { WorkspaceProvider } from './lib/contexts/WorkspaceContext';

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
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <WorkspaceProvider>
            <App {...props} />
            <CreateTeamModal />
            <Toaster />
          </WorkspaceProvider>
        </ModalProvider>
      </QueryClientProvider>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});
