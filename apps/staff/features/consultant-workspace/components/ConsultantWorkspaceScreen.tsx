"use client";

import { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import {
  privatePreviewMessages,
  privatePreviewRooms,
} from "../data/private-preview";
import {
  useConsultantConversation,
  useConsultantRooms,
} from "../hooks/useConsultantWorkspace";
import type { WorkspaceMessage, WorkspaceRoom } from "../types/workspace";
import {
  ConversationList,
  type StatusFilter,
  type ChatKind,
} from "./ConversationList";
import { ConversationPanel } from "./ConversationPanel";

const READ_STORAGE_KEY = "beewise_consultant_last_read";

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

  // Lưu vết thời gian đọc tin nhắn từng phòng
  const [lastReadMap, setLastReadMap] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(READ_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Khởi tạo timestamp đọc ban đầu cho các phòng chưa có
  useEffect(() => {
    setLastReadMap((prev) => {
      let changed = false;
      const next = { ...prev };
      const allRaw = [...roomsQuery.rooms, ...privatePreviewRooms];
      for (const r of allRaw) {
        if (!next[r.id]) {
          next[r.id] = r.updatedAt || r.createdAt || new Date().toISOString();
          changed = true;
        }
      }
      if (changed) {
        try {
          localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  }, [roomsQuery.rooms]);

  // Cập nhật timestamp khi phòng được xem
  useEffect(() => {
    if (!selectedId) return;
    setLastReadMap((prev) => {
      const next = { ...prev, [selectedId]: new Date().toISOString() };
      try {
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [selectedId, kind]);

  const previewRooms = privatePreviewRooms.map((room): WorkspaceRoom => {
    const list = previewMessages[room.id] ?? [];
    const latestMsg = list.at(-1);
    const updated = latestMsg?.createdAt ?? room.updatedAt;
    const lastRead = lastReadMap[room.id];
    const isUnread =
      Boolean(lastRead) &&
      Boolean(updated) &&
      new Date(updated).getTime() > new Date(lastRead!).getTime() + 1000;
    const unreadCount = isUnread
      ? list.filter(
          (m) =>
            new Date(m.createdAt).getTime() > new Date(lastRead!).getTime(),
        ).length || 1
      : 0;

    return {
      ...room,
      updatedAt: updated,
      status: closedPreviewIds.includes(room.id) ? "CLOSED" : room.status,
      closeReason: previewClosure[room.id]?.reason,
      closeNote: previewClosure[room.id]?.note,
      unreadCount,
    };
  });

  const groupRooms = roomsQuery.rooms.map((room): WorkspaceRoom => {
    const lastRead = lastReadMap[room.id];
    const isUnread =
      Boolean(lastRead) &&
      Boolean(room.updatedAt) &&
      new Date(room.updatedAt).getTime() > new Date(lastRead!).getTime() + 1000;
    return {
      ...room,
      unreadCount: isUnread ? 1 : 0,
    };
  });

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
      const next: WorkspaceMessage = {
        id: `preview-${Date.now()}`,
        senderId: "preview-consultant",
        content,
        createdAt: new Date().toISOString(),
      };
      setPreviewMessages((current) => ({
        ...current,
        [selectedRoom.id]: [...(current[selectedRoom.id] ?? []), next],
      }));
      // Cập nhật timestamp đọc ngay cho phòng hiện tại
      setLastReadMap((prev) => ({
        ...prev,
        [selectedRoom.id]: new Date().toISOString(),
      }));
      return;
    }
    await conversation.sendMessage(content);
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
    <div className="flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden p-2.5 sm:p-3 lg:p-4">
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
            error={Boolean(roomsQuery.error)}
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
