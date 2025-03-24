import { FontFamilySelector } from '@/components/features/document-editor/FontFamilySelector';
import { FontSizeSelector } from '@/components/features/document-editor/FontSizeSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Editor, useEditorState } from '@tiptap/react';
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
  PrinterIcon,
  Redo2Icon,
  Share2,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react';

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

export default function Toolbar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }: { editor: Editor }) => ({
      canUndo: editor.can().undo(),
    }),
  });

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
      // {
      //   label: 'Print',
      //   icon: PrinterIcon,
      //   onClick: () => window.print(),
      // },
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
    <>
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
            value={'Untitled document'}
            className="flex h-9 w-full border-0 bg-transparent px-3 py-1 text-lg font-medium outline-none placeholder:text-muted-foreground focus:bg-transparent focus:hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex space-x-6">
          <Button
            className="rounded-full border px-6 shadow-sm"
            variant="ghost"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>

          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>DN</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
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
    </>
  );
}
