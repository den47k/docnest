import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  LucideIcon,
  PrinterIcon,
  Redo2Icon,
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
  ];

  return (
    <div className="flex min-h-[40px] items-center gap-x-0.5 overflow-x-auto rounded-3xl bg-[#F1F4F9] px-2.5 py-0.5">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="mx-0.5 h-6 bg-neutral-300" />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
}
