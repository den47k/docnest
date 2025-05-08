import { Button, buttonVariants } from '@/components/ui/button';
import { useSidebar } from '@/lib/contexts/SidebarContext';
import { useWorkspace } from '@/lib/contexts/WorkspaceContext';
import { Link, usePage } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Menu, Plus, Settings, Trash2, Users } from 'lucide-react';
import React, { ElementType, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type SidebarProps = React.ComponentProps<'div'> & {
  currentPath: string;
};

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, currentPath, ...props }, ref) => {
    const { url: currentUrl } = usePage();
    const queryClient = useQueryClient();
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { currentTeam } = useWorkspace();

    const getPathFromUrl = (url: string): string => {
      try {
        return new URL(url).pathname;
      } catch {
        return new URL(url, window.location.origin).pathname;
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node)
        ) {
          toggleSidebar();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isSidebarOpen, toggleSidebar]);

    const createNewDocument = async () => {
      try {
        const response = await axios.post(route('documents.store'), {
          team_id: currentTeam.id === 'personal' ? null : currentTeam.id,
        });
        const newDocument = response.data.document;
        await queryClient.invalidateQueries({
          queryKey: ['documents', currentTeam.id],
        });
        window.location.href = route('documents.show', {
          document: newDocument.id,
        });
      } catch (error) {
        console.error('Failed to create document:', error);
      }
    };

    return (
      <div className="group" data-state={isSidebarOpen ? 'open' : 'closed'}>
        <aside
          ref={sidebarRef}
          className={twMerge(
            'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-gray-50 transition-transform duration-200 ease-in-out',
            'group-data-[state=closed]:-translate-x-full group-data-[state=open]:translate-x-0',
            className,
          )}
          {...props}
        >
          {/* Application Name */}
          <div className="mx-6 my-4 text-lg font-bold">DocNest</div>

          {/* Create New Document Button */}
          <div className="px-4 pb-4">
            <Button
              className="w-full justify-start"
              onClick={createNewDocument}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Document
            </Button>
          </div>

          {/* Sidebar Items */}
          <nav className="space-y-1 p-2">
            <SidebarItem
              Icon={FileText}
              title="Documents"
              url={route('index')}
              isActive={getPathFromUrl(route('index')) === currentPath}
            />
            <SidebarItem
              Icon={Users}
              title="Teams"
              url={route('teams.index')}
              isActive={getPathFromUrl(route('teams.index')) === currentPath}
            />
            <SidebarItem Icon={Trash2} title="Trash Can" url="/trash" />
            <SidebarItem Icon={Settings} title="Settings" url="/settings" />
          </nav>
        </aside>
      </div>
    );
  },
);

Sidebar.displayName = 'Sidebar';

type SidebarItemProps = {
  Icon: ElementType;
  title: string;
  url: string;
  isActive?: boolean;
};

function SidebarItem({ Icon, title, url, isActive }: SidebarItemProps) {
  return (
    <Link
      href={url}
      className={twMerge(
        buttonVariants({ variant: 'ghost' }),
        `flex w-full items-center justify-start gap-4 rounded-lg ${
          isActive ? 'bg-secondary hover:bg-secondary-accent' : undefined
        }`,
      )}
    >
      <Icon className="h-6 w-6" />
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </div>
    </Link>
  );
}

const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-2"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export { Sidebar, SidebarTrigger };
