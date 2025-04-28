import { EditorContent, useEditor } from '@tiptap/react';

import { FontSizeExtension } from '@/extensions/font-size';
import FontFamily from '@tiptap/extension-font-family';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

import { TiptapCollabProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';

import { debounce } from '@/lib/utils';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import Toolbar from './partials/Toolbar';
import './styles.css';

import { Document } from '@/types';

const ydoc = new Y.Doc();

export default function Editor({
  document,
  canEdit,
  collaborationToken,
}: {
  document: Document;
  canEdit: boolean;
  collaborationToken: string;
}) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class:
          'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    editable: canEdit,
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      FontSizeExtension,
      FontFamily,
      TextAlign.configure({ types: ['paragraph'] }),
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
    ],
  });

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: document.id,
      appId: import.meta.env.VITE_TIPTAP_APP_ID,
      token: collaborationToken,
      document: ydoc,
      onSynced() {
        if (!ydoc.getMap('config').get('initialContentLoaded') && editor) {
          ydoc.getMap('config').set('initialContentLoaded', true);
          editor.commands.setContent(JSON.parse(document.content));
        }
      },
    });

    return () => {
      provider.destroy();
    };
  }, [document.id, editor, ydoc]);

  if (!editor) return null;

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
