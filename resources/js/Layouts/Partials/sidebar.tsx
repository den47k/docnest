import { buttonVariants } from '@/Components/ui/button';
import { ElementType, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { FileText, Trash2, Users, Plus, Settings } from 'lucide-react';
import { usesidebarContext } from '@/contexts/SidebarContext';
import { Button } from '@/Components/ui/button';

export function Sidebar() {
  const { isSidebarOpen, setSidebarClose } = usesidebarContext();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sidebarRef.current || sidebarRef.current.contains(event.target as Node)) {
      return;
    }
    setSidebarClose();
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/0 z-[998]"
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={twMerge(
          `fixed left-0 top-0 h-full w-64 bg-gray-50 dark:bg-gray-800 z-[999] shadow-lg transform transition-transform duration-300`,
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Application Name */}
        <div className="text-lg font-bold mx-6 my-4">DockNest</div>

        {/* Create New Document Button */}
        <div className='flex items-center justify-center'>
          <Button>
            <Plus />
            Create New Document
          </Button>
        </div>


        {/* Sidebar Items */}
        <div className="flex flex-col gap-4 px-2 py-6">
          <SidebarItem Icon={FileText} title="Documents" url="/" isActive />
          <SidebarItem Icon={Users} title="Teams" url="/teams" />
          <SidebarItem Icon={Trash2} title="Trash Can" url="/trash" />
          <SidebarItem Icon={Settings} title="Settings" url="/settings" />
        </div>
      </aside>
    </>
  );
}

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
        }`
      )}
    >
      <Icon className="w-6 h-6" />
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>
    </a>
  );
}
