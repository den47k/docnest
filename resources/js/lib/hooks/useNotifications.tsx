import { TeamInvitation } from '@/types';
import { ToastAction } from '@radix-ui/react-toast';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

declare const window: any;

export const useNotifications = (
  userId: number,
  toast: any,
  dismiss: any,
  initialInvitations?: TeamInvitation[],
) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<TeamInvitation[]>(
    initialInvitations || [],
  );
  const [notificationQueue, setNotificationQueue] = useState<TeamInvitation[]>(
    [],
  );

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
    if (notificationQueue.length > 0) {
      setNotificationQueue([]);

      notificationQueue.forEach((notification) => {
        const toastId = toast({
          title: 'Team Invitation',
          description: `${notification.inviter_name} invited you to join ${notification.team_name}.`,
          duration: 20000,
          action: (
            <>
              <ToastAction
                className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                altText="Deny"
                onClick={() => {
                  handleInvitationAction(notification, 'deny', toastId.id);
                }}
              >
                Deny
              </ToastAction>
              <ToastAction
                className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                altText="Accept"
                onClick={() => {
                  handleInvitationAction(notification, 'accept', toastId.id);
                }}
              >
                Accept
              </ToastAction>
            </>
          ),
        });

        notification.toastId = toastId.id;
      });
    }
  }, [notificationQueue, toast]);

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

      if (action === 'accept') {
        await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      }

      setNotifications((prev) => [
        ...prev.filter((n) => n.invitation_id !== invitation.invitation_id),
      ]);

      if (toastId) {
        dismiss(toastId);
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
    handleInvitationAction,
  };
};
