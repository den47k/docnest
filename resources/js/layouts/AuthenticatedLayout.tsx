import { SidebarProvider } from '@/lib/contexts/SidebarContext';
import { WorkspaceProvider } from '@/lib/contexts/WorkspaceContext';
import { ReactNode } from 'react';
import { Header } from './partials/Header';
import { Sidebar } from './partials/Sidebar';

declare const window: any;

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    // <WorkspaceProvider>
      <SidebarProvider>
        <div className="flex max-h-screen flex-col">
          <Header />
          <Sidebar />
          {children}
        </div>
      </SidebarProvider>
    // </WorkspaceProvider>
  );
}
