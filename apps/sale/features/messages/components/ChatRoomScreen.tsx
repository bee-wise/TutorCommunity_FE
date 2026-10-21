"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { ChatRoomPanel } from "./ChatRoomPanel";
import { MessagesScreen } from "./MessagesScreen";
import { ChatSidebar } from "./ChatSidebar";
import { saveLastActiveChatRoomId } from "../constants/messages.utils";
import type { ChatParticipantRole } from "../types/messages.types";

const SIDEBAR_COLLAPSED_KEY = "beewise:chat-sidebar-collapsed";

/** Chat room page: panel only (mobile) or sidebar + panel (desktop) */
export function ChatRoomScreen({ chatRoomId }: { chatRoomId?: string }) {
  const user = useAuthStore((s) => s.user);
  const currentUserRole = (user?.role?.toUpperCase() || "LEARNER") as ChatParticipantRole;

  // Remember the user's choice; default to the narrow rail on screens under 1280px.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      return stored === null ? window.innerWidth < 1280 : stored === "1";
    } catch {
      return window.innerWidth < 1280;
    }
  });

  useEffect(() => {
    if (chatRoomId) {
      saveLastActiveChatRoomId(chatRoomId, currentUserRole);
    }
  }, [chatRoomId, currentUserRole]);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // Ignore storage errors; the toggle still works for this session.
      }
      return next;
    });
  }

  if (!chatRoomId) return <MessagesScreen />;


  return (
    <div className="flex h-full gap-2 overflow-hidden p-2">
      {/* Sidebar - hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <ChatSidebar
          key={chatRoomId}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
        />
      </div>

      {/* Main Panel - full width on mobile, flex-1 on lg+ */}
      <div className="flex-1 min-w-0">
        <ChatRoomPanel key={chatRoomId} chatRoomId={chatRoomId} />
      </div>
    </div>
  );
}
