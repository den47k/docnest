import { EditorContent, useEditor } from '@tiptap/react';

import FontFamily from '@tiptap/extension-font-family';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

import { FontSizeExtension } from '@/extensions/font-size';

import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import Toolbar from './partials/Toolbar';
import './styles.css';

import { Document } from '@/types';

declare const window: any;

export default function Editor({ document }: {document: Document}) {
  const clientId = usePage().props.auth.user.id;
  const stepsBuffer = useRef<any[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const versionRef = useRef(0);

  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class:
          'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
      StarterKit.configure({}),
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
  });

  if (!editor) return;

  useEffect(() => {
    if (window?.Echo) {
      const channel = window.Echo.private(`documents.${document.id}`);

      channel.listen('.document.updated', (operations) => {
        console.log('Received operations:', operations);
      });

      return () => {
        channel.stopListening('.DocumentUpdated');
      };
    }
  }, [document]);

  useEffect(() => {
    if (!editor) return;

    const mergeSteps = (steps: any[]) => {
      if (steps.length === 0) return [];

      const merged: any[] = [];
      let currentMerge: any = null;
      let expectedInsertionFrom: number | null = null;

      for (const step of steps) {
        if (step.stepType !== 'replace') {
          if (currentMerge) {
            merged.push(currentMerge);
            currentMerge = null;
            expectedInsertionFrom = null;
          }
          merged.push(step);
          continue;
        }

        const isInsertion = step.from === step.to;
        const isDeletion = step.from < step.to;
        const hasTextContent =
          isInsertion && step.slice.content?.[0]?.type === 'text';

        // Merge insertion operations that are typed letter by letter
        if (isInsertion && hasTextContent) {
          const textContent = step.slice.content[0].text;

          if (
            currentMerge !== null &&
            currentMerge?.from === currentMerge?.to
          ) {
            if (step.from === expectedInsertionFrom) {
              currentMerge.slice.content[0].text += textContent;
              expectedInsertionFrom = step.from + 1;
            } else {
              merged.push(currentMerge);
              currentMerge = { ...step };
              expectedInsertionFrom = step.from + 1;
            }
          } else {
            if (currentMerge) merged.push(currentMerge);
            currentMerge = { ...step };
            expectedInsertionFrom = step.from + 1;
          }
        }

        // Merge deletion operations that are removed letter by letter
        else if (isDeletion) {
          if ((currentMerge !== null) && (currentMerge?.from < currentMerge?.to)) {
            if (step.from <= currentMerge.to && step.to >= currentMerge.from) {
              currentMerge.from = Math.min(currentMerge.from, step.from);
              currentMerge.to = Math.max(currentMerge.to, step.to);
            } else {
              merged.push(currentMerge);
              currentMerge = { ...step };
            }
          } else {
            if (currentMerge) merged.push(currentMerge);
            currentMerge = { ...step };
          }
        }

        // Handle other replace types
        else {
          if (currentMerge) {
            merged.push(currentMerge);
            currentMerge = null;
            expectedInsertionFrom = null;
          }
          merged.push(step);
        }
      }

      // No change for everything else
      if (currentMerge) merged.push(currentMerge);

      return merged;
    };

    const handleUpdate = ({ transaction }: { transaction: any }) => {
      if (transaction.steps.length === 0) return;

      stepsBuffer.current.push(...transaction.steps);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        try {
          const stepsToSend = stepsBuffer.current;
          stepsBuffer.current = [];

          const stepsJSON = stepsToSend.map((step) => step.toJSON());
          const mergedSteps = mergeSteps(stepsJSON);

          console.log(mergedSteps);

          await axios.post(route('documents.handleOperations', document.id), {
            steps: mergedSteps,
            clientId,
            version: versionRef.current,
          });

          versionRef.current++;
        } catch (error) {
          console.error('Update failed:', error);
        }
      }, 500);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
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



