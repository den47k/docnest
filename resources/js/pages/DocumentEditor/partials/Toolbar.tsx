import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import {
  BoldIcon,
  FileText,
  ItalicIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
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
        'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
        isActive && 'bg-neutral-200/80',
      )}
    >
      <Icon className="size-4"></Icon>
    </button>
  );
}

export default function Toolbar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
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
      {
        label: 'Print',
        icon: PrinterIcon,
        onClick: () => window.print(),
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
        label: 'Comment',
        icon: MessageSquarePlusIcon,
        onClick: () => console.log('huy'),
        isActive: false,
      },
      {
        label: 'List ToDo',
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive('taskList'),
      },
      {
        label: 'Remove Formatting',
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <>
      {/* Menu Bar */}
    <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center">
          <FileText className="mr-2 h-6 w-6 cursor-pointer" strokeWidth={1.5} />
          <input
            value={'Untitled document'}
            className="flex h-9 w-full border-0 bg-transparent px-3 py-1 text-lg font-medium outline-none placeholder:text-muted-foreground focus:bg-transparent focus:hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            className="gap-2 rounded-full border px-6 shadow-sm"
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
      <div className="flex items-center px-4 py-1 border-b bg-muted/30 gap-x-0.5 overflow-x-auto">
        {sections[0].map((item) => (
          <ToolbarButton key={item.label} {...item} />
        ))}
        <Separator
          orientation="vertical"
          className="mx-0.5 h-6 bg-neutral-300"
        />
        {/* ToDo: Font family */}
        <Separator
          orientation="vertical"
          className="mx-0.5 h-6 bg-neutral-300"
        />
        {/* ToDo: Heading */}
        <Separator
          orientation="vertical"
          className="mx-0.5 h-6 bg-neutral-300"
        />
        {/* ToDo: Font size */}
        <Separator
          orientation="vertical"
          className="mx-0.5 h-6 bg-neutral-300"
        />
        {sections[1].map((item) => (
          <ToolbarButton key={item.label} {...item} />
        ))}
        {/* ToDo: Text color */}
        {/* ToDo: Highlight color */}
        <Separator
          orientation="vertical"
          className="mx-0.5 h-6 bg-neutral-300"
        />
        {/* ToDo: Link */}
        {/* ToDo: Image */}
        {/* ToDo: Align */}
        {/* ToDo: Line height */}
        {/* ToDo: List */}
        {sections[2].map((item) => (
          <ToolbarButton key={item.label} {...item} />
        ))}
      </div>
    </>
  );
}
