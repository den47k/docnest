import { useNotifications } from "@/lib/hooks/useNotifications";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useToast } from "@/lib/hooks/use-toast";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, X } from "lucide-react";

export function NotificationPopover() {
  const { auth } = usePage<PageProps>().props;
  const { invitations, ...user } = auth.user;
  const { dismiss, toast } = useToast();

  const { notifications, handleInvitationAction } = useNotifications(
    user.id,
    toast,
    dismiss,
    invitations,
  );

  return (
    <div className="flex items-center space-x-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" alignOffset={-30} className="w-[350px] p-0">
          <div className="flex h-[40px] items-center border-b px-3 py-1">
            Notifications
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.invitation_id}
                className="relative flex cursor-default select-none items-center justify-between gap-2 rounded-sm px-3 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <div className="flex flex-col items-start justify-center">
                  <p className="text-xs font-medium">
                    {notification.inviter_name} invited to join the team:
                  </p>
                  <p className="text-base font-bold">
                    {notification.team_name}
                  </p>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      handleInvitationAction(
                        notification,
                        'deny',
                        notification.toastId,
                      );
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() =>
                      handleInvitationAction(
                        notification,
                        'accept',
                        notification.toastId,
                      )
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-gray-500">
              No new notifications
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
