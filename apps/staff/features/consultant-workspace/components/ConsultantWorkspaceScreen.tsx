"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import {
  privatePreviewMessages,
  privatePreviewRooms,
} from "../data/private-preview";
import {
  useConsultantConversation,
  useConsultantRooms,
} from "../hooks/useConsultantWorkspace";
import {
  participantName,
  type WorkspaceMessage,
  type WorkspaceRoom,
} from "../types/workspace";
import { initials } from "../utils/format";
import {
  ConversationList,
  type StatusFilter,
  type ChatKind,
} from "./ConversationList";
import { ConversationPanel } from "./ConversationPanel";

const DUO_FLOWER =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_440/v1790241784/Bee_Robot_1.png";
const BEEWISE_LOGO_MARK =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_80/v1789964842/Logo_1.png";
const LIST_COLLAPSED_KEY ="beewise:staff-chat-list-collapsed";

export function ConsultantWorkspaceScreen() {
  const [kind, setKind] = useState<ChatKind>("group");
  const [status, setStatus] = useState<StatusFilter>("ACTIVE");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const [showConversationOnMobile, setShowConversationOnMobile] =
    useState(false);
  // Remember the user's choice; default to the narrow rail on screens under 1280px.
  const [listCollapsed, setListCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(LIST_COLLAPSED_KEY);
      return stored === null ? window.innerWidth < 1280 : stored === "1";
    } catch {
      return window.innerWidth < 1280;
    }
  });
  const [previewMessages, setPreviewMessages] = useState(
    privatePreviewMessages,
  );
  const [closedPreviewIds, setClosedPreviewIds] = useState<string[]>([]);
  const [previewClosure, setPreviewClosure] = useState<
    Record<string, { reason: string; note?: string }>
  >({});
  const consultantId = useAuthStore((state) => state.user?.id) ?? "";
  const roomsQuery = useConsultantRooms();
  const lastReadRequestedRef = useRef<string | null>(null);

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
    };
  });

  const groupRooms = roomsQuery.rooms;

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
  const latestMessageId = messages.at(-1)?.id;
  const selectedRoomId = selectedRoom?.id;
  const selectedRoomIsMock = selectedRoom?.isMock ?? false;
  const selectedLastReadId = selectedRoom?.lastReadMessageId;
  const { markRead } = conversation;

  useEffect(() => {
    if (!selectedRoomId || selectedRoomIsMock || !latestMessageId || conversation.history.isLoading) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const markVisibleRoomRead = () => {
      if (
        document.visibilityState !== "visible" ||
        !(showConversationOnMobile || desktop.matches) ||
        selectedLastReadId === latestMessageId ||
        lastReadRequestedRef.current === latestMessageId
      ) return;
      lastReadRequestedRef.current = latestMessageId;
      markRead(latestMessageId, {
        onError: () => {
          lastReadRequestedRef.current = null;
        },
      });
    };
    markVisibleRoomRead();
    desktop.addEventListener("change", markVisibleRoomRead);
    document.addEventListener("visibilitychange", markVisibleRoomRead);
    return () => {
      desktop.removeEventListener("change", markVisibleRoomRead);
      document.removeEventListener("visibilitychange", markVisibleRoomRead);
    };
  }, [selectedRoomId, selectedRoomIsMock, latestMessageId, selectedLastReadId, conversation.history.isLoading, showConversationOnMobile, markRead]);

  function toggleList() {
    setListCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(LIST_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // Ignore storage errors; the toggle still works for this session.
      }
      return next;
    });
  }

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
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-muted p-2">
      <div
        className={`grid h-full min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden ${
          listCollapsed
            ? "lg:grid-cols-[72px_minmax(0,1fr)]"
            : "lg:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]"
        }`}
      >
        {/* Left Column: Conversation List with top Chat Kind switcher */}
        <div
          className={`${
            showConversationOnMobile ? "hidden lg:flex" : "flex"
          } h-full min-h-0 flex-col overflow-hidden`}
        >
          {listCollapsed && (
            <nav
              aria-label="Danh sách phòng chat thu gọn"
              className="hidden h-full w-full flex-col items-center gap-1.5 overflow-y-auto rounded-3xl border border-border bg-card py-2 shadow-soft lg:flex"
            >
              <Link
                href="/consultant/tutors"
                aria-label="BeeWise - Danh sách gia sư"
                className="relative mb-1 block size-10 shrink-0"
              >
                <Image
                  src={BEEWISE_LOGO_MARK}
                  alt="BeeWise"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </Link>
              {visibleRooms.map((room) => {
                const name =
                  participantName(room, "LEARNER") ||
                  room.participants[0]?.name ||
                  "BW";
                const unread = room.unreadCount ?? 0;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedId(room.id)}
                    title={name}
                    aria-label={name}
                    aria-current={selectedRoom?.id === room.id ? "true" : undefined}
                    className={`relative flex size-12 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                      selectedRoom?.id === room.id
                        ? "border-primary bg-muted"
                        : "border-transparent hover:border-border hover:bg-muted"
                    }`}
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
                      {initials(name)}
                    </span>
                    {unread > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-destructive-foreground">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
          <div className={listCollapsed ? "h-full min-h-0 lg:hidden" : "h-full min-h-0"}>
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
            error={roomsQuery.error}
            onRetry={() => void roomsQuery.refetch()}
            isPreview={kind === "private"}
          />
          </div>
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
              listCollapsed={listCollapsed}
              onToggleList={toggleList}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center shadow-xs">
              <Image
                src={DUO_FLOWER}
                alt="Ong BeeWise và robot trao nhau một bông hoa"
                width={220}
                height={165}
                className="mb-3 h-auto w-52"
              />
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
