import { Document } from '@/types';
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense';
import Editor from './partials/Editor';

// import '@liveblocks/react-tiptap/styles.css';
// import '@liveblocks/react-ui/styles.css';
import "./styles.css"


export default function DocumentPage({
  document,
  canEdit,
}: {
  document: Document;
  canEdit: boolean;
}) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_Cnb7TlvLYpzkpcA2daJPUmnSSTOXtSRKYp6WkP3iXPRt53Yi9f0r0tJbA8Qx0qzr"}>
      <RoomProvider id={document.id} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<div>Loading document...</div>}>
          <Editor canEdit={canEdit} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
