"use client";

import Link from "next/link";
import {
  ChatCircle,
  ArrowRight,
  CaretRight,
  ChatDots,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/ui/button";
import { useMessages } from "../hooks/useMessages";
import type { ChatRoom } from "../types/messages.types";
import {
  STAGE_LABELS,
  STAGE_COLORS,
  formatRelativeTime,
  saveLastActiveChatRoomId,
} from "../constants/messages.utils";

function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
        STAGE_COLORS[stage] ?? "bg-card text-muted-foreground border-border"
      }`}
    >
      {STAGE_LABELS[stage] ?? stage}
    </span>
  );
}

export function ChatRow({ room }: { room: ChatRoom }) {
  return (
    <Link
      href={`/tutor/messages/${room.id}`}
      onClick={() => saveLastActiveChatRoomId(room.id, "TUTOR")}
      className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-hover)] hover:border-primary/40 active:translate-y-px sm:flex-row sm:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
        {room.learner.initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <strong className="text-sm font-bold text-foreground">
            {room.learner.name}
          </strong>
          {room.unreadCount > 0 && (
            <span
              aria-label={`${room.unreadCount} tin nhắn chưa đọc`}
              className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-black text-accent-foreground"
            >
              {room.unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {room.hasConnectionDetails
            ? `${room.subject} ${room.gradeLevel}`
            : "Cuộc trò chuyện kết nối"}
        </p>
        <p className="mt-0.5 truncate text-sm text-foreground/80">
          {room.lastMessage ?? "Mở cuộc trò chuyện"}
        </p>
        {room.hasConnectionDetails && (
          <div className="mt-1.5">
            <StageBadge stage={room.connectionStage} />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        {room.lastMessageAt ? formatRelativeTime(room.lastMessageAt) : ""}
        <CaretRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" weight="bold" />
      </div>
    </Link>
  );
}

export function ChatSummary() {
  const { rooms, totalUnread, loading, error, refetch } = useMessages();
  const active = rooms.filter((r) => r.status === "ACTIVE").length;

  const stats = [
    { label: "Cuộc hội thoại", value: rooms.length },
    { label: "Đang hoạt động", value: active },
    { label: "Chưa đọc", value: totalUnread },
  ] as const;

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-nunito text-base font-extrabold text-foreground">
          Tin nhắn &amp; Kết nối
        </h2>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 rounded-full border-border px-3 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Link href="/tutor/messages" className="flex items-center gap-1">
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5" weight="bold" />
          </Link>
        </Button>
      </div>

      {/* Stats row — opaque border cards, no pastel wash */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]"
          >
            <strong className="font-nunito text-xl font-black tabular-nums text-primary">
              {value}
            </strong>
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-8 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ChatCircle className="h-5 w-5" weight="regular" />
          </span>
          <p className="text-sm text-muted-foreground">
            Không tải được cuộc trò chuyện.{" "}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="mt-3 rounded-full font-bold"
          >
            Thử lại
          </Button>
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-8 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ChatDots className="h-5 w-5" weight="bold" />
          </span>
          <strong className="text-sm font-bold text-foreground">
            Chưa có cuộc trò chuyện mới
          </strong>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Khi Learner kết nối với hồ sơ của bạn, phòng chat sẽ xuất hiện tại
            đây.
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


