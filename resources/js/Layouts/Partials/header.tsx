import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/Components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Input } from '@/Components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import { useModal } from '@/contexts/ModalContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Check, ChevronsUpDown, Menu, Search, X } from 'lucide-react';
import { TeamInvitation } from '../AuthenticatedLayoutProto';

const teams = [
  { value: 'personal', label: 'Personal' },
  { value: 'acme', label: 'Acme Inc.' },
  { value: 'monsters', label: 'Monsters Inc.' },
];

type HeaderProps = {
  notifications: TeamInvitation[];
  onInvitationAction: (invitation: TeamInvitation, action: 'accept' | 'deny') => void;
};

export function Header({ notifications, onInvitationAction }: HeaderProps) {
  const user = usePage().props.auth.user;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [value, setValue] = useState('acme');

  const { setSidebarOpen } = useSidebarContext();
  const { openCreateTeam } = useModal();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={setSidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold">DockNest</span>
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
                {value
                  ? teams.find((team) => team.value === value)?.label
                  : 'Select team...'}
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
                        key={team.value}
                        value={team.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setIsPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === team.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {team.label}
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
                      // className="px-3 py-2 last:border-none"
                      className="relative flex justify-between cursor-default select-none items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
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
                          onClick={() => onInvitationAction(notification, 'deny')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => onInvitationAction(notification, 'accept')}
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
                <div onClick={openCreateTeam}>New Team</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={route('logout')} method="post" as="button">
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
