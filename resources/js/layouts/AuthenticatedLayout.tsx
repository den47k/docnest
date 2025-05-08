import { CreateTeamModal } from '@/components/features/teams/CreateTeamModal';
import { Toaster } from '@/components/ui/toaster';
import { ModalProvider } from '@/lib/contexts/ModalContext';
import { SidebarProvider } from '@/lib/contexts/SidebarContext';
import { WorkspaceProvider } from '@/lib/contexts/WorkspaceContext';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Header } from './partials/Header';
import { Sidebar } from './partials/Sidebar';

declare const window: any;

type AuthenticatedLayoutProps = {
  showExtras?: boolean;
  children: ReactNode;
};

export default function AuthenticatedLayout({
  showExtras = true,
  children,
}: AuthenticatedLayoutProps) {
  const { user } = usePage().props.auth;

  const { url } = usePage();
  const currentPath = new URL(url, window.location.origin).pathname;
  return (
    <ModalProvider>
      <WorkspaceProvider user={user}>
        <SidebarProvider>
          <div className="flex max-h-screen flex-col">
            <Header showExtras={showExtras} />
            <Sidebar currentPath={currentPath} />
            {children}
            <CreateTeamModal />
            <Toaster />
          </div>
        </SidebarProvider>
      </WorkspaceProvider>
    </ModalProvider>
  );
}
