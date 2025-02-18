import { useEffect, useState } from "react"
import axios from "axios";
import { TeamInvitation } from "@/layouts/AuthenticatedLayout";
import { ToastAction } from "@radix-ui/react-toast";

declare const window: any;

export const useNotifications = (userId: number, toast: any, dismiss: any) => {
  const [notifications, setNotifications] = useState<TeamInvitation[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<TeamInvitation[]>([]);
  const [currentNotification, setCurrentNotification] = useState<TeamInvitation | null>(null);

  useEffect(() => {
    axios
      .get(route('teams.invitations.index'))
      .then((response) => {
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, []);


  useEffect(() => {
    if (window?.Echo) {
      const channel = window.Echo.private(`App.Models.User.${userId}`);

      channel.notification((notification: any) => {
        setNotificationQueue((prev) => [...prev, notification]);
        setNotifications((prev) => [...prev, notification]);
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [userId]);

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

  return {
    notifications,
    notificationQueue,
    currentNotification,
    handleInvitationAction,
    handleNotificationClose,
  };
}
