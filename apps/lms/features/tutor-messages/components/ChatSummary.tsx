"use client";

import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";
import { useMessages } from "../hooks/useMessages";
import type { ChatRoom } from "../types/messages.types";
import { STAGE_LABELS, STAGE_COLORS, formatRelativeTime } from "../constants/messages.utils";

const card = "rounded-2xl border border-[#e5eaf5] bg-white p-5 sm:p-6 shadow-sm";

function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
        STAGE_COLORS[stage] ?? "bg-gray-100 text-gray-600 border-gray-200"
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
      className="flex flex-col gap-2 rounded-xl border border-[#e5eaf5] p-4 transition hover:border-[#280f91]/30 hover:bg-[#faf9ff] sm:flex-row sm:items-center"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfe1fa] text-sm font-black text-[#280f91]">
        {room.learner.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <strong className="text-sm">{room.learner.name}</strong>
          {room.unreadCount > 0 && (
            <span
              aria-label={`${room.unreadCount} tin nhắn chưa đọc`}
              className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffc500] px-1 text-[9px] font-black text-[#280f91]"
            >
              {room.unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs text-[#716c83]">
          {room.subject} {room.gradeLevel} · {room.teachingMode}
        </p>
        <p className="mt-1 truncate text-sm text-[#0c0c0b]">
          {room.lastMessage ?? "Chưa có tin nhắn"}
        </p>
        <div className="mt-1.5">
          <StageBadge stage={room.connectionStage} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#716c83]">
        {room.lastMessageAt ? formatRelativeTime(room.lastMessageAt) : ""}
        <ChevronRight size={14} />
      </div>
    </Link>
  );
}

export function ChatSummary() {
  const { rooms } = useMessages();
  const unread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
  const active = rooms.filter((r) => r.status === "ACTIVE").length;
  const waiting = rooms.filter((r) => r.unreadCount > 0).length;

  return (
    <section className={card}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#280f91]">Tin nhắn và kết nối gần đây</h2>
        <Link className="text-sm font-bold text-[#280f91] hover:underline" href="/tutor/messages">
          Xem tất cả
        </Link>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            ["Cuộc trò chuyện", rooms.length],
            ["Đang hoạt động", active],
            ["Chưa đọc", unread],
            ["Chờ phản hồi", waiting],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[#f4f1ff] p-3">
            <strong className="block text-xl text-[#280f91]">{value}</strong>
            <span className="text-xs text-[#66617c]">{label}</span>
          </div>
        ))}
      </div>
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-[#cbd6ea] p-8 text-center">
          <span className="mb-3 text-[#280f91]">
            <MessageCircle />
          </span>
          <strong>Chưa có cuộc trò chuyện mới</strong>
          <p className="mt-1 max-w-md text-sm text-[#716c83]">
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
