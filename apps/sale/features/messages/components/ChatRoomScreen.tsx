"use client";
import { useEffect } from "react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { ChatRoomPanel } from "./ChatRoomPanel";
import { MessagesScreen } from "./MessagesScreen";
import { ChatSidebar } from "./ChatSidebar";
import { saveLastActiveChatRoomId } from "../constants/messages.utils";
import type { ChatParticipantRole } from "../types/messages.types";

/** Chat room page: panel only (mobile) or sidebar + panel (desktop) */
export function ChatRoomScreen({ chatRoomId }: { chatRoomId?: string }) {
  const user = useAuthStore((s) => s.user);
  const currentUserRole = (user?.role?.toUpperCase() || "LEARNER") as ChatParticipantRole;

  useEffect(() => {
    if (chatRoomId) {
      saveLastActiveChatRoomId(chatRoomId, currentUserRole);
    }
  }, [chatRoomId, currentUserRole]);

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
