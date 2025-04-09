import { EditorContent, useEditor } from '@tiptap/react';

import FontFamily from '@tiptap/extension-font-family';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { FontSizeExtension } from '@/extensions/font-size';

import Collaboration from '@tiptap/extension-collaboration';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

import { useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { debounce } from '@/lib/utils';
import Toolbar from './partials/Toolbar';
import './styles.css';

import { Document } from '@/types';

export default function Editor({ document }: { document: Document }) {
  const ydoc = useMemo(() => new Y.Doc(), [document.id]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class:
          'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      FontSizeExtension,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
    ],
  });

  // Debounced save handler
  const handleSave = useRef(
    debounce((content: any) => {
      axios.put(`/documents/${document.id}`, { content })
        .catch((error) => console.error('Save failed:', error));
    }, 1000)
  ).current;

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: document.id,
      appId: '7j9y6m10',
      token: 'notoken',
      document: ydoc,
      onSynced() {
        if (!ydoc.getMap('config').get('initialContentLoaded') && editor) {
          ydoc.getMap('config').set('initialContentLoaded', true);
          editor.commands.setContent(JSON.parse(document.content));
        }
      },
    });

    const handleUpdate = () => {
      const initialLoaded = ydoc.getMap('config').get('initialContentLoaded');
      if (initialLoaded && editor) {
        const content = editor.getJSON();
        handleSave(content);
      }

      console.log(editor?.getJSON());
    };

    ydoc.on('update', handleUpdate);

    return () => {
      ydoc.off('update', handleUpdate);
      provider.destroy();
      // Clear any pending saves on unmount
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [document.id, editor, ydoc, handleSave]);

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



