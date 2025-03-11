import { SidebarProvider } from '@/lib/contexts/SidebarContext';
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
    <SidebarProvider>
      <div className="flex max-h-screen flex-col">
        <Header />
        <Sidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
