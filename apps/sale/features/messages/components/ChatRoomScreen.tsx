"use client";

import { ChatRoomPanel } from "./ChatRoomPanel";
import { MessagesScreen } from "./MessagesScreen";
import { ChatSidebar } from "./ChatSidebar";

/** Chat room page: panel only (mobile) or sidebar + panel (desktop) */
export function ChatRoomScreen({ chatRoomId }: { chatRoomId?: string }) {
  if (!chatRoomId) return <MessagesScreen />;


  return (
    <div className="flex h-full gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4">
      {/* Sidebar - hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <ChatSidebar key={chatRoomId} />
      </div>

      {/* Main Panel - full width on mobile, flex-1 on lg+ */}
      <div className="flex-1 min-w-0">
        <ChatRoomPanel key={chatRoomId} chatRoomId={chatRoomId} />
      </div>
    </div>
  );
}
