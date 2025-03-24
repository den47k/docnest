import { cn } from "@/lib/utils";
import { Editor, useEditorState } from "@tiptap/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FontFamilySelector({ editor }: { editor: Editor }) {
  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georia", value: "Georia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-36 inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none hover:bg-accent hover:text-accent-foreground py-2 px-1.5">
          <span
            style={{ fontFamily: editor?.getAttributes("textStyle").fontFamily }}
            className="truncate">{editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="ml-1 size-4 shrink-0 opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="min-w-36 p-1 rounded-md border shadow-sm bg-white z-50">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            className={cn(
              "flex items-center px-2 py-1.5 cursor-pointer text-sm rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none",
              editor?.getAttributes("textStyle").fontFamily === value && "bg-accent text-accent-foreground",
            )}
            style={{ fontFamily: value }}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
