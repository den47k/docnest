import { SidebarProvider } from '@/lib/contexts/SidebarContext';
import { WorkspaceProvider } from '@/lib/contexts/WorkspaceContext';
import { ReactNode } from 'react';
import { Header } from './partials/Header';
import { Sidebar } from './partials/Sidebar';
import { usePage } from '@inertiajs/react';

declare const window: any;

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { user } = usePage().props.auth;
  return (
    <WorkspaceProvider user={user}>
      <SidebarProvider>
        <div className="flex max-h-screen flex-col">
          <Header />
          <Sidebar />
          {children}
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
