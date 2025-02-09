import { CreateTeamModal } from '@/Components/CreateTeamModal';
import { Toaster } from '@/Components/ui/toaster';
import { ModalProvider } from '@/contexts/ModalContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { useToast } from '@/hooks/use-toast';
import { usePage } from '@inertiajs/react';
import { ToastAction } from '@radix-ui/react-toast';
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
  toastId?: string;
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
  const { toast, dismiss } = useToast();

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
        setNotifications((prev) => [...prev, notification]);
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user.id]);

  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setNotificationQueue((prev) => prev.slice(1));

      const toastId = toast({
        title: 'Team Invitation',
        description: `${nextNotification.inviter_name} invited you to join ${nextNotification.team_name}.`,
        duration: 6000,
        action: (
          <>
            <ToastAction
              className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              altText="Deny"
              onClick={() => {
                handleInvitationAction(nextNotification, 'deny', toastId.id);
                handleNotificationClose();
              }}
            >
              Deny
            </ToastAction>
            <ToastAction
              className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              altText="Accept"
              onClick={() => {
                handleInvitationAction(nextNotification, 'accept', toastId.id);
                handleNotificationClose();
              }}
            >
              Accept
            </ToastAction>
          </>
        ),
      });

      nextNotification.toastId = toastId.id;
    }
  }, [notificationQueue, currentNotification, toast]);

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  const handleInvitationAction = async (
    invitation: TeamInvitation,
    action: 'accept' | 'deny',
    toastId?: string,
  ) => {
    try {
      const endpoint =
        action === 'accept'
          ? route('teams.invitations.store', {
              invitation: invitation.invitation_id,
            })
          : route('teams.invitations.destroy', {
              invitation: invitation.invitation_id,
            });

      await (action === 'accept'
        ? axios.post(endpoint)
        : axios.delete(endpoint));

      setNotifications((prev) =>
        prev.filter((n) => n.invitation_id !== invitation.invitation_id),
      );

      if (currentNotification?.invitation_id === invitation.invitation_id) {
        setCurrentNotification(null);
      }

      if (toastId) {
        dismiss(toastId)
      }

    } catch (error) {
      console.error(
        `Error ${action === 'accept' ? 'accepting' : 'denying'} invitation`,
        error,
      );
    }
  };

  return (
    <SidebarProvider>
      <ModalProvider>
        <div className="flex max-h-screen flex-col">
          <Header
            notifications={notifications}
            onInvitationAction={handleInvitationAction}
          />
          <Sidebar />
          {children}
          <CreateTeamModal />
          <Toaster />
        </div>
      </ModalProvider>
    </SidebarProvider>
  );
}
