"use client";

import Link from "next/link";
import {
  ChatBubbleLeftRightIcon as MessageCircle,
  ChevronRightIcon as ChevronRight,
} from "@heroicons/react/24/outline";
import { useMessages } from "../hooks/useMessages";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import type { ChatRoom } from "../types/messages.types";
import { STAGE_LABELS, STAGE_COLORS, formatRelativeTime } from "../constants/messages.utils";

const card = "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6";

function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
        STAGE_COLORS[stage] ?? "border-border bg-muted text-muted-foreground"
      }`}
    >
      {STAGE_LABELS[stage] ?? stage}
    </span>
  );
}

export function ChatRow({ room }: { room: ChatRoom }) {
  return (
    <Link
      href={`/lms/tutor/messages/${room.id}`}
      className="flex flex-col gap-2 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-muted/40 active:scale-[0.98] sm:flex-row sm:items-center"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
        {room.learner.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <strong className="text-sm">{room.learner.name}</strong>
          {room.unreadCount > 0 && (
            <span
              aria-label={`${room.unreadCount} tin nhắn chưa đọc`}
              className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-destructive-foreground"
            >
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {room.subject || `Kết nối #${room.connectRequestId.slice(0, 8)}`}
        </p>
        <p className="mt-1 truncate text-sm text-foreground">
          {room.lastMessage ?? "Mở cuộc trò chuyện"}
        </p>
        <div className="mt-1.5">
          <StageBadge stage={room.connectionStage} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {room.lastMessageAt ? formatRelativeTime(room.lastMessageAt) : ""}
        <ChevronRight width={14} height={14} />
      </div>
    </Link>
  );
}

export function ChatSummary() {
  const { rooms, loading, error } = useMessages();
  const active = rooms.filter((r) => r.status === "ACTIVE").length;

  return (
    <section className={card}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-primary">Tin nhắn và kết nối gần đây</h2>
        <Link className="rounded-lg px-2 py-1 text-sm font-bold text-primary transition-all hover:bg-muted hover:text-primary/80 active:scale-[0.98]" href="/lms/tutor/messages">
          Xem tất cả
        </Link>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        {(
          [
            ["Cuộc trò chuyện", rooms.length],
            ["Đang hoạt động", active],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-xl bg-muted p-3">
            <strong className="block text-xl text-primary">{value}</strong>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Đang tải cuộc trò chuyện...</p>
      ) : error ? (
        <p role="alert" className="py-8 text-center text-sm text-destructive">{getApiErrorMessage(error)}</p>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border p-8 text-center">
          <span className="mb-3 text-primary">
            <MessageCircle />
          </span>
          <strong>Chưa có cuộc trò chuyện mới</strong>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Khi Learner kết nối với hồ sơ của bạn, phòng chat sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.slice(0, 3).map((room) => (
            <ChatRow key={room.id} room={room} />
          ))}
        </div>
      )}
    </section>
  );
}
