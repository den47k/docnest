import { SidebarProvider } from '@/lib/contexts/SidebarContext';
import { useToast } from '@/lib/hooks/use-toast';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Header } from '../partials/Header';
import { Sidebar } from '../partials/Sidebar';

declare const window: any;

export type TeamInvitation = {
  invitation_id: string;
  team_id: number;
  team_name: string;
  inviter_id: number;
  inviter_name: string;
  inviter_email: string;
  email: string;
  message: string;
  toastId?: string;
};

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const user = usePage().props.auth.user;
  const { toast, dismiss } = useToast();
  const { notifications, handleInvitationAction } = useNotifications(
    user.id,
    toast,
    dismiss,
  );

  return (
    <SidebarProvider>
      <div className="flex max-h-screen flex-col">
        <Header
          notifications={notifications}
          onInvitationAction={handleInvitationAction}
        />
        <Sidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
