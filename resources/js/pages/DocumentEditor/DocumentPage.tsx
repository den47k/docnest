import { Document } from '@/types';
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense';
import Editor from './partials/Editor';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import './styles.css';
import { Head } from '@inertiajs/react';

export default function DocumentPage({
  document,
  canEdit,
}: {
  document: Document;
  canEdit: boolean;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    };
  }, [queryClient]);

  return (
    <>
      <Head title={document.title} />
      <LiveblocksProvider
        publicApiKey={
          'pk_dev_Cnb7TlvLYpzkpcA2daJPUmnSSTOXtSRKYp6WkP3iXPRt53Yi9f0r0tJbA8Qx0qzr'
        }
      >
        <RoomProvider id={document.id} initialPresence={{ cursor: null }}>
          <ClientSideSuspense fallback={<div>Loading document...</div>}>
            <Editor document={document} canEdit={canEdit} />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </>
  );
}
