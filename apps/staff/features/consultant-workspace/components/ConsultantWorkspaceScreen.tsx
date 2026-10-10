"use client";

import { useEffect, useState } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon as MessageCircleMore,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import {
  privatePreviewMessages,
  privatePreviewRooms,
} from "../data/private-preview";
import {
  useConsultantConversation,
  useConsultantRooms,
} from "../hooks/useConsultantWorkspace";
import { useConsultantUnread } from "../hooks/useConsultantUnread";
import type { WorkspaceMessage, WorkspaceRoom } from "../types/workspace";
import {
  ConversationList,
  type StatusFilter,
  type ChatKind,
} from "./ConversationList";
import { ConversationPanel } from "./ConversationPanel";

export function ConsultantWorkspaceScreen() {
  const [kind, setKind] = useState<ChatKind>("group");
  const [status, setStatus] = useState<StatusFilter>("ACTIVE");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const [showConversationOnMobile, setShowConversationOnMobile] =
    useState(false);
  const [previewMessages, setPreviewMessages] = useState(
    privatePreviewMessages,
  );
  const [closedPreviewIds, setClosedPreviewIds] = useState<string[]>([]);
  const [previewClosure, setPreviewClosure] = useState<
    Record<string, { reason: string; note?: string }>
  >({});
  const consultantId = useAuthStore((state) => state.user?.id) ?? "";
  const roomsQuery = useConsultantRooms();
  const { unreadCounts, markRead } = useConsultantUnread(
    consultantId,
    roomsQuery.rooms,
    privatePreviewRooms,
    previewMessages,
  );

  const previewRooms = privatePreviewRooms.map((room): WorkspaceRoom => {
    const list = previewMessages[room.id] ?? [];
    const latestMsg = list.at(-1);
    const updated = latestMsg?.createdAt ?? room.updatedAt;
    return {
      ...room,
      updatedAt: updated,
      status: closedPreviewIds.includes(room.id) ? "CLOSED" : room.status,
      closeReason: previewClosure[room.id]?.reason,
      closeNote: previewClosure[room.id]?.note,
      unreadCount: unreadCounts[room.id] ?? 0,
    };
  });

  const groupRooms = roomsQuery.rooms.map((room): WorkspaceRoom => ({
    ...room,
    unreadCount: unreadCounts[room.id] ?? 0,
  }));

  const allRooms = kind === "group" ? groupRooms : previewRooms;
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");

  const visibleRooms = allRooms.filter(
    (room) =>
      (status === "ALL" ||
        (status === "ACTIVE"
          ? room.status === "ACTIVE"
          : room.status !== "ACTIVE")) &&
      (!normalizedQuery ||
        room.participants.some((person) =>
          person.name.toLocaleLowerCase("vi").includes(normalizedQuery),
        ) ||
        room.connectRequestId?.toLowerCase().includes(normalizedQuery)),
  );

  const selectedRoom =
    visibleRooms.find((room) => room.id === selectedId) ??
    visibleRooms[0] ??
    null;

  const conversation = useConsultantConversation(
    selectedRoom && !selectedRoom.isMock ? selectedRoom.id : null,
  );

  const messages = selectedRoom?.isMock
    ? (previewMessages[selectedRoom.id] ?? [])
    : conversation.messages;
  const latestMessageAt = messages.at(-1)?.createdAt;
  const selectedRoomId = selectedRoom?.id;
  const selectedRoomIsMock = selectedRoom?.isMock ?? false;

  useEffect(() => {
    if (!selectedRoomId || !latestMessageAt || (!selectedRoomIsMock && conversation.history.isLoading)) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const markVisibleRoomRead = () => {
      if (document.visibilityState === "visible" && (showConversationOnMobile || desktop.matches)) {
        markRead(selectedRoomId, latestMessageAt);
      }
    };
    markVisibleRoomRead();
    desktop.addEventListener("change", markVisibleRoomRead);
    document.addEventListener("visibilitychange", markVisibleRoomRead);
    return () => {
      desktop.removeEventListener("change", markVisibleRoomRead);
      document.removeEventListener("visibilitychange", markVisibleRoomRead);
    };
  }, [selectedRoomId, selectedRoomIsMock, latestMessageAt, conversation.history.isLoading, showConversationOnMobile, markRead]);

  const activeCount = allRooms.filter(
    (room) => room.status === "ACTIVE",
  ).length;
  const closedCount = allRooms.length - activeCount;

  function switchKind(next: ChatKind) {
    setKind(next);
    setStatus("ACTIVE");
    setQuery("");
    setSelectedId(undefined);
    setShowConversationOnMobile(false);
  }

  async function sendMessage(content: string) {
    if (!selectedRoom) return;
    if (selectedRoom.isMock) {
      const createdAt = new Date().toISOString();
      const next: WorkspaceMessage = {
        id: `preview-${createdAt}`,
        senderId: "preview-consultant",
        content,
        createdAt,
      };
      setPreviewMessages((current) => ({
        ...current,
        [selectedRoom.id]: [...(current[selectedRoom.id] ?? []), next],
      }));
      markRead(selectedRoom.id, next.createdAt);
      return;
    }
    const sent = await conversation.sendMessage(content);
    markRead(selectedRoom.id, sent.createdAt);
  }

  async function closeRoom(reason: string, note?: string) {
    if (!selectedRoom) return;
    if (selectedRoom.isMock) {
      setClosedPreviewIds((current) => [...current, selectedRoom.id]);
      setPreviewClosure((current) => ({
        ...current,
        [selectedRoom.id]: { reason, note },
      }));
    } else {
      await conversation.closeRoom({ reason, note });
    }
    setStatus("CLOSED");
    setSelectedId(selectedRoom.id);
  }

  const groupUnreadCount = groupRooms.filter(
    (r) => (r.unreadCount ?? 0) > 0,
  ).length;
  const privateUnreadCount = previewRooms.filter(
    (r) => (r.unreadCount ?? 0) > 0,
  ).length;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-muted p-2.5 sm:p-3 lg:p-4">
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* Left Column: Conversation List with top Chat Kind switcher */}
        <div
          className={`${
            showConversationOnMobile ? "hidden lg:flex" : "flex"
          } h-full min-h-0 flex-col overflow-hidden`}
        >
          <ConversationList
            rooms={visibleRooms}
            selectedId={selectedRoom?.id}
            query={query}
            onQueryChange={setQuery}
            onSelect={(id) => {
              setSelectedId(id);
              const room = allRooms.find((item) => item.id === id);
              const throughAt = room?.isMock
                ? previewMessages[id]?.at(-1)?.createdAt
                : room?.lastMessageAt;
              if (throughAt) markRead(id, throughAt);
              setShowConversationOnMobile(true);
            }}
            kind={kind}
            onKindChange={switchKind}
            groupUnreadCount={groupUnreadCount}
            privateUnreadCount={privateUnreadCount}
            status={status}
            onStatusChange={(newStatus) => {
              setStatus(newStatus);
              setSelectedId(undefined);
            }}
            activeCount={activeCount}
            closedCount={closedCount}
            totalCount={allRooms.length}
            loading={roomsQuery.isLoading}
            error={roomsQuery.error}
            onRetry={() => void roomsQuery.refetch()}
            isPreview={kind === "private"}
          />
        </div>

        {/* Right Column: Conversation Panel with Info Modal */}
        <div
          className={`${
            showConversationOnMobile ? "flex" : "hidden lg:flex"
          } h-full min-h-0 min-w-0 flex-col overflow-hidden`}
        >
          {selectedRoom ? (
            <ConversationPanel
              key={selectedRoom.id}
              room={selectedRoom}
              messages={messages}
              consultantId={consultantId}
              loading={!selectedRoom.isMock && conversation.history.isLoading}
              error={selectedRoom.isMock ? null : conversation.history.error}
              sending={!selectedRoom.isMock && conversation.sending}
              closing={!selectedRoom.isMock && conversation.closing}
              hasOlder={
                !selectedRoom.isMock &&
                Boolean(conversation.history.hasNextPage)
              }
              loadingOlder={
                !selectedRoom.isMock &&
                conversation.history.isFetchingNextPage
              }
              onLoadOlder={() => void conversation.history.fetchNextPage()}
              onRetry={() => void conversation.history.refetch()}
              onSend={sendMessage}
              onClose={closeRoom}
              onBack={() => setShowConversationOnMobile(false)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center shadow-xs">
              <MessageCircleMore className="mb-3 size-10 text-primary/35" />
              <h2 className="font-nunito text-lg font-extrabold text-foreground">
                Chọn một cuộc trò chuyện
              </h2>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                Chọn phòng từ danh sách bên trái để xem tin nhắn và hỗ trợ kết
                nối.
              </p>
              <button
                type="button"
                onClick={() => setShowConversationOnMobile(false)}
                className="mt-4 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary lg:hidden"
              >
                Quay lại danh sách
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
