import { EditorContent, useEditor } from '@tiptap/react';
import { Collaboration } from "@tiptap/extension-collaboration";

import FontFamily from '@tiptap/extension-font-family';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

import { FontSizeExtension } from '@/extensions/font-size';

import Toolbar from './partials/Toolbar';
import './styles.css';
import { useEffect } from 'react';
import axios from 'axios';

export default function Editor() {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class:
          'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
      StarterKit,
      FontSizeExtension,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Underline,
    ],
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  if (!editor) return;

  useEffect(() => {
    let updateTimeout: ReturnType<typeof setTimeout>;
    editor?.on('update', ({ transaction }) => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        if (transaction.steps.length > 0) {
          axios.post('/documents/update', {
            // version: editor.getExtension('collaboration').getVersion(),
            steps: transaction.steps,
          });
        }
      }, 200);

    });
  }, []);

  return (
    <>
      <Toolbar editor={editor} />
      <div className="size-full overflow-x-auto bg-gray-50 px-4 pt-[90px] print:overflow-visible print:bg-white print:p-0">
        <div className="mx-auto flex w-[816px] min-w-max flex-col justify-center py-4 print:w-full print:min-w-0 print:py-0">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}

