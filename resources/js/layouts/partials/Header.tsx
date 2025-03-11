import { useEffect, useState } from 'react';

import { CreateTeamModalTrigger } from '@/components/common/CreateTeamModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/lib/hooks/use-toast';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bell, Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { SidebarTrigger } from './Sidebar';
import { TeamInvitation } from '@/types';
import { PageProps } from '@/types';

export const Header = () => {
  const { auth, invitations } = usePage<PageProps>().props;
  const { teams, selectedTeam, ...user } = auth.user;
  const { dismiss, toast } = useToast();

  const { notifications, handleInvitationAction } = useNotifications(
    user.id,
    toast,
    dismiss,
    invitations
  );

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(selectedTeam || null);

  const handleTeamSelect = async (teamId: string) => {
    if (currentTeam && currentTeam.id === teamId) return;

    const selected = teams.find(team => team.id === teamId) || null;
    setCurrentTeam(selected);

    try {
      await axios.post(route('teams.select'), { team_id: teamId });
      router.reload();
    } catch (error) {
      console.error('Failed to update team:', error);
    }
  };

  useEffect(() => {
    console.log('Notifications: ' + JSON.stringify(invitations, null, 2));
  }, [invitations]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <span className="text-lg font-bold cursor-pointer select-none">DocNest</span>
        </div>

        {/* Search Bar */}
        <div className="max-w-[500px] flex-1 px-6">
          <form>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full rounded-full pl-10"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Team Selector */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="w-[150px] justify-between rounded-full"
              >
                {currentTeam ? currentTeam.name : 'Personal'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search team..." />
                <CommandList>
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup>
                    {teams.map((team) => (
                      <CommandItem
                        key={team.id}
                        value={team.id}
                        onSelect={() => {
                          handleTeamSelect(team.id);
                          setIsPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            currentTeam?.id === team.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {team.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Notifications */}
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
              <PopoverContent
                align="end"
                alignOffset={-30}
                className="w-[350px] p-0"
              >
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
                            console.log(notification);
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

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback>DN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={route('profile.edit')}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <CreateTeamModalTrigger />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  className="flex h-full w-full"
                  href={route('logout')}
                  method="post"
                  as="button"
                >
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
