"use client";

import Link from "next/link";
import { Search, MessageCircleIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import type { ChatRoom } from "../types/messages.types";
import {
  STAGE_LABELS,
  STAGE_COLORS,
  formatRelativeTime,
} from "../constants/messages.utils";

const STATUS_ROOM_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  CLOSED: "Đã đóng",
  CONVERTED_TO_CLASS: "Thành lớp học",
};

function RoomRow({ room }: { room: ChatRoom }) {
  const isReadOnly = room.status !== "ACTIVE";

  const basePath = "/lms/tutor/messages";

  return (
    <Link
      href={`${basePath}/${room.id}`}
      className="group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3.5 transition hover:border-[#280f91]/20 hover:bg-[#f7f9ff]"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#cfe1fa] text-sm font-black text-[#280f91]">
          {room.learner.initials}
        </div>
        {room.learner.isOnline && !isReadOnly && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#447353]" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1">
          <span className="truncate text-sm font-bold text-[#0c0c0b] group-hover:text-[#280f91]">
            {room.learner.name}
          </span>
          {room.lastMessageAt && (
            <time className="shrink-0 text-[10px] text-[#c2c7d6]">
              {formatRelativeTime(room.lastMessageAt)}
            </time>
          )}
        </div>

        {/* Subject + Stage */}
        <p className="mb-0.5 text-[11px] text-[#667085]">
          {room.subject} {room.gradeLevel}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-[#667085]">
            {room.lastMessage ?? "Chưa có tin nhắn"}
          </p>
          {room.unreadCount > 0 && (
            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#280f91] px-1 text-[9px] font-black text-white">
              {room.unreadCount}
            </span>
          )}
        </div>

        {/* Stage badge */}
        <span
          className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
            isReadOnly
              ? "border-gray-200 bg-gray-100 text-gray-500"
              : (STAGE_COLORS[room.connectionStage] ??
                "bg-gray-100 text-gray-600 border-gray-200")
          }`}
        >
          {isReadOnly
            ? STATUS_ROOM_LABELS[room.status]
            : STAGE_LABELS[room.connectionStage]}
        </span>
      </div>
    </Link>
  );
}

export function ChatSidebar() {
  const { rooms } = useMessages();
  const [query, setQuery] = useState("");

  const filtered = rooms.filter(
    (r) =>
      query === "" ||
      r.learner.name.toLowerCase().includes(query.toLowerCase()) ||
      r.subject.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e5eaf5] bg-white shadow-sm">
      {/* Header */}
      <div className="shrink-0 border-b border-[#f0f3f9] px-4 py-4 flex flex-col gap-4">
        {/* Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/lms/tutor/dashboard"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7f9ff] text-[#280f91] transition hover:bg-[#e6edfa]"
            aria-label="Quay lại Trang chủ"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-lg font-extrabold text-[#0c0c0b]">Tin nhắn</h2>
            <p className="text-xs text-[#667085]">Phòng chat 3 bên</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-[#f0f3f9] px-3 py-2.5">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm học viên, môn học..."
            className="w-full rounded-xl border border-[#e5eaf5] bg-[#f7f9ff] py-2 pl-8 pr-3 text-xs outline-none focus:border-[#280f91] focus:ring-2 focus:ring-[#280f91]/20"
          />
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <MessageCircleIcon size={32} className="mb-3 text-[#c2c7d6]" />
            <strong className="text-sm text-[#0c0c0b]">
              {query ? "Không tìm thấy" : "Chưa có cuộc trò chuyện"}
            </strong>
            <p className="mt-1 text-xs text-[#667085]">
              {query
                ? "Thử tìm kiếm khác"
                : "Khi Learner kết nối với bạn, phòng chat sẽ hiện tại đây."}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((room) => (
              <RoomRow key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
