import { NotificationPopover } from '@/components/features/notifications/NotificationPopover';
import { CreateTeamModalTrigger } from '@/components/features/teams/CreateTeamModal';
import { TeamSelector } from '@/components/features/teams/TeamSelector';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { SidebarTrigger } from './Sidebar';
import { useQueryClient } from '@tanstack/react-query';

export const Header = ({ showExtras = true }: { showExtras?: boolean }) => {
  const { url } = usePage();
  const { auth } = usePage<PageProps>().props;
  const { invitations, ...user } = auth.user;

  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(url.split('?')[1] || '');
  const searchValue = queryParams.get('search') || '';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <span className="cursor-pointer select-none text-lg font-bold">
            <Link className="h-full w-full" href={route('index')}>
              Docnest
            </Link>
          </span>
        </div>

        {/* Search Bar */}
        {showExtras && (
          <div className="max-w-[500px] flex-1 px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const search = formData.get('search');
                router.get(route('index'), { search });
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search documents..."
                  className="w-full rounded-full pl-10"
                  defaultValue={searchValue}
                />
              </div>
            </form>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {showExtras && <TeamSelector />}

          <NotificationPopover />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
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
                <Link className="h-full w-full" href={route('profile.edit')}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <CreateTeamModalTrigger useCustomButton={true} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  className="flex h-full w-full"
                  href={route('logout')}
                  method="post"
                  as="button"
                  onClick={(e) => {
                    queryClient.invalidateQueries({ queryKey: ['workspaces'] });
                  }}
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
