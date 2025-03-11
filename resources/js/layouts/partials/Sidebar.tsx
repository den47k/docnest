import { Button, buttonVariants } from '@/components/ui/button';
import { useSidebar } from '@/lib/contexts/SidebarContext';
import { FileText, Menu, Plus, Settings, Trash2, Users } from 'lucide-react';
import React, { ElementType, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Close sidebar when clicking outside
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
            <Button className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create New Document
            </Button>
          </div>

          {/* Sidebar Items */}
          <nav className="space-y-1 p-2">
            <SidebarItem Icon={FileText} title="Documents" url="/" isActive />
            <SidebarItem Icon={Users} title="Teams" url="/teams" />
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

function SidebarItem({ Icon, title, url, isActive = false }: SidebarItemProps) {
  return (
    <a
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
    </a>
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
