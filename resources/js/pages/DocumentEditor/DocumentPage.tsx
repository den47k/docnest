import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import Editor from "./partials/Editor";
import { Document } from "@/types";

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";

export default function DocumentPage({ document }: { document: Document }) {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_Cnb7TlvLYpzkpcA2daJPUmnSSTOXtSRKYp6WkP3iXPRt53Yi9f0r0tJbA8Qx0qzr">
      <RoomProvider id={document.id}>
        <ClientSideSuspense fallback={<div>Loading document...</div>}>
          <Editor
            document={document}
            canEdit={true}
          />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
