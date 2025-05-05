import { FontFamilySelector } from '@/components/features/document-editor/FontFamilySelector';
import { FontSizeSelector } from '@/components/features/document-editor/FontSizeSelector';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Document } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Editor } from '@tiptap/react';
import axios from 'axios';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  FileText,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  Redo2Icon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

declare const window: any;

type ToolbarButtonProps = {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
};

function ToolbarButton({ icon: Icon, isActive, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
      )}
    >
      <Icon className="size-4"></Icon>
    </button>
  );
}

export default function Toolbar({
  document,
  editor,
  canEdit,
}: {
  document: Document;
  editor: Editor;
  canEdit: boolean;
}) {
  const { user } = usePage().props.auth;
  const [documentTitle, setDocumentTitle] = useState(document.title);
  const [isDocumentTitleDirty, setIsDocumentTitleDirty] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const serverTitleRef = useRef(document.title);

  useEffect(() => {
    setIsDocumentTitleDirty(documentTitle != serverTitleRef.current);
  }, [documentTitle, serverTitleRef]);

  useEffect(() => {
    const channel = window.Echo.channel(`documents.${document.id}`);

    channel.listen('.title.updated', ({ title }: { title: string }) => {
      serverTitleRef.current = title;
      setDocumentTitle(title);
      setIsDocumentTitleDirty(false);
    });

    return () => {
      channel.stopListening('.title.updated');
      window.Echo.leaveChannel(`documents.${document.id}`);
    };
  }, [document.id, canEdit]);

  const handleRename = async () => {
    if (!documentTitle.trim() || isUpdating) return;

    try {
      setIsUpdating(true);
      await axios.put(route('documents.update', { document: document.id }), {
        title: documentTitle,
      });
    } catch (error) {
      console.error('Title update failed:', error);
      setDocumentTitle(document.title);
    } finally {
      setIsUpdating(false);
      setIsDocumentTitleDirty(false);
    }
  };

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: 'Undo',
        icon: Undo2Icon,
        onClick: () => editor.chain().focus().undo().run(),
      },
      {
        label: 'Redo',
        icon: Redo2Icon,
        onClick: () => editor.chain().focus().redo().run(),
      },
    ],
    [
      {
        label: 'Bold',
        icon: BoldIcon,
        isActive: editor.isActive('bold'),
        onClick: () => editor.chain().focus().toggleBold().run(),
      },
      {
        label: 'Italic',
        icon: ItalicIcon,
        isActive: editor.isActive('italic'),
        onClick: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        label: 'Underline',
        icon: UnderlineIcon,
        isActive: editor.isActive('underline'),
        onClick: () => editor.chain().focus().toggleUnderline().run(),
      },
    ],
    [
      {
        label: 'Align Left',
        icon: AlignLeftIcon,
        onClick: () => editor?.chain().focus().setTextAlign('left').run(),
        isActive: editor?.isActive({ textAlign: 'left' }),
      },
      {
        label: 'Align Center',
        icon: AlignCenterIcon,
        onClick: () => editor?.chain().focus().setTextAlign('center').run(),
        isActive: editor?.isActive({ textAlign: 'center' }),
      },
      {
        label: 'Align Right',
        icon: AlignRightIcon,
        onClick: () => editor?.chain().focus().setTextAlign('right').run(),
        isActive: editor?.isActive({ textAlign: 'right' }),
      },
      {
        label: 'Align Justify',
        icon: AlignJustifyIcon,
        onClick: () => editor?.chain().focus().setTextAlign('justify').run(),
        isActive: editor?.isActive({ textAlign: 'justify' }),
      },
    ],
    [
      {
        label: 'Bullet List',
        icon: ListIcon,
        onClick: () => editor?.chain().focus().toggleBulletList().run(),
        isActive: editor?.isActive('bulletList'),
      },
      {
        label: 'Ordered List',
        icon: ListOrderedIcon,
        onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        isActive: editor?.isActive('orderedList'),
      },
      {
        label: 'List ToDo',
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive('taskList'),
      },
    ],
  ];

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-white">
      {/* Menu Bar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center">
          <Link href={route('index')}>
            <FileText
              className="mr-2 h-6 w-6 cursor-pointer"
              strokeWidth={1.5}
            />
          </Link>
          <input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="flex h-9 w-full border-0 bg-transparent px-3 py-1 text-lg font-medium outline-none placeholder:text-muted-foreground focus:bg-transparent focus:hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed"
            disabled={isUpdating || !canEdit}
          />
          {isDocumentTitleDirty && (
            <Button
              className="rounded-full shadow-sm"
              onClick={handleRename}
              variant={'outline'}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Rename'}
            </Button>
          )}
        </div>

        <div className="flex space-x-6">
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
        </div>
      </div>

      {/* Toolbar */}
      {canEdit && (
        <div className="flex items-center gap-x-0.5 overflow-x-auto border-b bg-muted/30 px-4 py-1">
          {sections[0].map((item) => (
            <ToolbarButton key={item.label} {...item} />
          ))}
          <Separator
            orientation="vertical"
            className="mx-0.5 h-6 bg-neutral-300"
          />
          <FontFamilySelector editor={editor} />
          <Separator
            orientation="vertical"
            className="mx-0.5 h-6 bg-neutral-300"
          />
          <FontSizeSelector editor={editor} />
          <Separator
            orientation="vertical"
            className="mx-0.5 h-6 bg-neutral-300"
          />
          {sections[1].map((item) => (
            <ToolbarButton key={item.label} {...item} />
          ))}
          <Separator
            orientation="vertical"
            className="mx-0.5 h-6 bg-neutral-300"
          />
          {sections[2].map((item) => (
            <ToolbarButton key={item.label} {...item} />
          ))}
          <Separator
            orientation="vertical"
            className="mx-0.5 h-6 bg-neutral-300"
          />
          {sections[3].map((item) => (
            <ToolbarButton key={item.label} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
