"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftIcon as ArrowLeft,
  LockClosedIcon as Lock,
  EllipsisVerticalIcon as MoreVertical,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { MessageBubble, SessionTimeDivider } from "./MessageBubble";
import { MessageDetailsDialog } from "./MessageDetailsDialog";
import { MessageContextMenu } from "./MessageContextMenu";
import { ChatComposer } from "./ChatComposer";
import { ConsultantSupportBanner } from "./ConsultantSupportBanner";
import { ConnectionInfoPanel } from "./ConnectionInfoPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { selectChatWidgetTimelineMessages } from "@workspace/core/services/trial-widget-timeline";
import { STAGE_LABELS, STAGE_COLORS, shouldShowSessionDivider } from "../constants/messages.utils";
import type { ChatMessage } from "../types/messages.types";

import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";

const BEE_MEDITATE =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_280/v1789966153/8.png";

interface ChatRoomPanelProps {
  chatRoomId: string;
}

export function ChatRoomPanel({ chatRoomId }: ChatRoomPanelProps) {
  const {
    room,
    messages,
    sending,
    isReadOnly,
    currentUserId,
    currentUserRole,
    sendMessage,
    messagesEndRef,
    error,
    loading,
    hasOlderMessages,
    loadingOlderMessages,
    loadOlderMessages,
  } = useChatRoom(chatRoomId);

  const [showInfo, setShowInfo] = useState(false);
  const [selectedMessageForDetails, setSelectedMessageForDetails] = useState<ChatMessage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contextMenuState, setContextMenuState] = useState<{
    message: ChatMessage;
    position: { x: number; y: number };
  } | null>(null);

  // Rebuilt only when the messages change, not on every unrelated re-render.
  const visibleMessages = useMemo(
    () => selectChatWidgetTimelineMessages(messages, (message) => message.senderRole === "CONSULTANT"),
    [messages],
  );

  if (!room) return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
      {loading ? "Đang tải phòng chat..." : error ? getApiErrorMessage(error) : "Không tìm thấy phòng chat này."}
    </div>
  );
  const isSupport = room.category === "SUPPORT";
  const peer = isSupport ? room.consultant : room.learner;

  return (
    <div className="flex h-full min-h-0 gap-2 overflow-hidden">
      {/* ── Main chat area ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <header className="flex shrink-0 items-center gap-2.5 border-b border-border bg-card px-3 py-2 sm:px-4">
          <Link
            href="/lms/tutor/messages"
            className="flex min-h-11 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary lg:hidden"
            aria-label="Quay lại"
          >
            <ArrowLeft width={18} height={18} />
          </Link>

          {/* Learner avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
            {peer.initials}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-lms truncate text-sm font-extrabold leading-tight text-primary sm:text-base">
              {peer.name}
            </h1>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">
              {isSupport
                ? `Tư vấn viên BeeWise · ${room.subject}`
                : `Phòng kết nối · Chat 3 bên với ${room.consultant.name}`}
            </p>
          </div>

          {/* Stage badge */}
          <span
            className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold sm:block ${
              isSupport
                ? "border-secondary/30 bg-secondary/15 text-foreground"
                : STAGE_COLORS[room.connectionStage] ?? "bg-muted text-foreground border-border"
            }`}
          >
            {isSupport ? "Đang hỗ trợ" : STAGE_LABELS[room.connectionStage]}
          </span>

          {/* Info toggle */}
          {!isSupport && <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
              showInfo
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            }`}
            aria-label="Thông tin kết nối"
            aria-pressed={showInfo}
          >
            <MoreVertical width={20} height={20} />
          </button>}
        </header>

        {/* Read-only banner */}
        {isReadOnly && (
          <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted px-4 py-2.5 text-xs text-muted-foreground">
            <Lock width={13} height={13} />
            {room.status === "CONVERTED_TO_CLASS"
              ? "Phòng chat đã chuyển thành lớp học. Chỉ đọc."
              : isSupport ? "Cuộc trò chuyện hỗ trợ đã đóng. Chỉ đọc." : "Phòng chat đã đóng. Chỉ đọc."}
          </div>
        )}

        {/* Messages area */}
        <div className="min-h-0 flex-1 overflow-y-auto [scroll-behavior:auto] bg-muted px-2 py-3 sm:px-4">
          <div className="mx-auto max-w-5xl space-y-1">
            {hasOlderMessages && (
              <button type="button" disabled={loadingOlderMessages} onClick={() => void loadOlderMessages()} className="mx-auto mb-3 block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary disabled:opacity-50">
                {loadingOlderMessages ? "Đang tải..." : "Xem tin nhắn cũ"}
              </button>
            )}
            {!hasOlderMessages && (
              <ConsultantSupportBanner
                room={room}
                currentUserRole={currentUserRole}
              />
            )}
            {loading && <p className="py-8 text-center text-sm text-muted-foreground">Đang tải tin nhắn...</p>}
            {!loading && messages.length === 0 && !error && (
              <div className="flex flex-col items-center py-8 text-center">
                <Image
                  src={BEE_MEDITATE}
                  alt="Ong BeeWise đang thư giãn"
                  width={140}
                  height={140}
                  className="h-auto w-32"
                />
                <p className="mt-2 text-sm font-semibold text-foreground">Chưa có tin nhắn nào</p>
                <p className="text-xs text-muted-foreground">Hãy gửi lời chào để bắt đầu cuộc trò chuyện.</p>
              </div>
            )}
            {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{getApiErrorMessage(error)}</p>}
            {visibleMessages.map((msg, idx) => {
              const prev = visibleMessages[idx - 1];
              const next = visibleMessages[idx + 1];

              const isNewSession =
                !prev ||
                prev.type === "SYSTEM" ||
                shouldShowSessionDivider(msg.createdAt, prev.createdAt, 2);

              const isConsecutive =
                !isNewSession &&
                prev &&
                prev.senderId === msg.senderId &&
                prev.type !== "SYSTEM" &&
                msg.type !== "SYSTEM";

              const isNextNewSession =
                next &&
                shouldShowSessionDivider(next.createdAt, msg.createdAt, 2);

              // Chỉ hiển thị thời gian ở bubble cuối cùng trong 1 lượt của 1 người
              const isLastInTurn =
                !next ||
                next.type === "SYSTEM" ||
                next.senderId !== msg.senderId ||
                isNextNewSession;

              return (
                <div key={msg.id} className="flex flex-col">
                  {isNewSession && msg.type !== "SYSTEM" && (
                    <SessionTimeDivider timestamp={msg.createdAt} />
                  )}
                  <MessageBubble
                    message={msg}
                    currentUserId={currentUserId}
                    currentRole={currentUserRole}
                    roomClosed={room.status === "CLOSED"}
                    isConsecutive={!!isConsecutive}
                    showTime={isLastInTurn}
                    onContextMenu={(e, message) => {
                      setContextMenuState({
                        message,
                        position: { x: e.clientX, y: e.clientY },
                      });
                    }}
                  />
                </div>
              );
            })}
            {sending && (
              <div className="flex justify-end px-2 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Composer */}
        {!isReadOnly && <ChatComposer sending={sending} onSend={sendMessage} />}
      </div>

      {/* ── Info sidebar ───────────────────────────────────── */}
      {showInfo && !isSupport && (
        <div className="hidden w-72 shrink-0 overflow-y-auto lg:block">
          <ConnectionInfoPanel room={room} />
        </div>
      )}

      {/* ── Message Context Menu on Right-Click ─────────────── */}
      <MessageContextMenu
        message={contextMenuState?.message ?? null}
        position={contextMenuState?.position ?? null}
        onClose={() => setContextMenuState(null)}
        onViewDetails={(msg) => {
          setSelectedMessageForDetails(msg);
          setShowDetailsModal(true);
        }}
      />

      {/* ── Message Details Modal ───────────────────────────── */}
      <MessageDetailsDialog
        message={selectedMessageForDetails}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        currentUserId={currentUserId}
      />
    </div>
  );
}
