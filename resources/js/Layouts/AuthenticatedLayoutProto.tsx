import { CreateTeamModal } from '@/Components/CreateTeamModal';
import TeamInvitationNotification from '@/Components/TeamInvitationNotification';
import { ModalProvider } from '@/contexts/ModalContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Partials/header';
import { Sidebar } from './Partials/sidebar';

declare const window: any;

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const user = usePage().props.auth.user;
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    if (window?.Echo) {
      const channel = window.Echo.private(`App.Models.User.${user.id}`);

      channel.notification((notification: any) => {
        console.log('New notification:', notification);

        setNotifications((prev) => [...prev, notification]);
      });

      return () => {
        channel.stopListening('notification');
        channel.unsubscribe();
      };
    }
  }, []);

  return (
    <SidebarProvider>
      <ModalProvider>
        <div className="flex max-h-screen flex-col"></div>
        <Header />
        <Sidebar />
        {children}
        <CreateTeamModal />
        {notifications.map((notification) => (
          <TeamInvitationNotification
            key={notification.id}
            teamName={notification.team_name}
            onAccept={() => {
              console.log('Accepting invitation...');
            }}
            onDeny={() => {
              console.log('Denying invitation...');
            }}
          />
        ))}
      </ModalProvider>
    </SidebarProvider>
  );
}
