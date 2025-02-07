import { CreateTeamModal } from '@/Components/CreateTeamModal';
import TeamInvitationNotification from '@/Components/TeamInvitationNotification';
import { ModalProvider } from '@/contexts/ModalContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Partials/header';
import { Sidebar } from './Partials/sidebar';

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
};

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const user = usePage().props.auth.user;
  const [notifications, setNotifications] = useState<TeamInvitation[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<TeamInvitation[]>(
    [],
  );
  const [currentNotification, setCurrentNotification] =
    useState<TeamInvitation | null>(null);

  useEffect(() => {
    axios
      .get(route('teams.invitations.index'))
      .then((response) => {
        if (Array.isArray(response.data)) {
          console.log(response.data);
          setNotifications(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  useEffect(() => {
    if (window?.Echo) {
      const channel = window.Echo.private(`App.Models.User.${user.id}`);

      channel.notification((notification: TeamInvitation) => {
        console.log('New notification:', notification);
        setNotificationQueue((prev) => [...prev, notification]);
        setNotifications((prev) => [...prev, notification])
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user.id]);

  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue((prev) => prev.slice(1));
    }
  }, [notificationQueue, currentNotification]);

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  const handleInvitationAction = async (invitation: TeamInvitation, action: 'accept' | 'deny') => {
    try {
      const endpoint = action === 'accept'
        ? route('teams.invitations.store', { invitation: invitation.invitation_id })
        : route('teams.invitations.destroy', { invitation: invitation.invitation_id });

      await (action === 'accept' ? axios.post(endpoint) : axios.delete(endpoint));

      setNotifications((prev) => prev.filter((n) => n.invitation_id !== invitation.invitation_id));
      if (currentNotification?.invitation_id === invitation.invitation_id) {
        setCurrentNotification(null);
      }
    } catch (error) {
      console.error(`Error ${action === 'accept' ? 'accepting' : 'denying'} invitation`, error);
    }
  };

  return (
    <SidebarProvider>
      <ModalProvider>
        <div className="flex max-h-screen flex-col"></div>
        <Header notifications={notifications} onInvitationAction={handleInvitationAction} />
        <Sidebar />
        {children}
        <CreateTeamModal />
        {currentNotification && (
          <TeamInvitationNotification
            key={currentNotification.invitation_id}
            inviterName={currentNotification.inviter_name}
            teamName={currentNotification.team_name}
            onAccept={() => handleInvitationAction(currentNotification, 'accept')}
            onDeny={() => handleInvitationAction(currentNotification, 'deny')}
            handleNotificationClose={handleNotificationClose}
          />
        )}
      </ModalProvider>
    </SidebarProvider>
  );
}
