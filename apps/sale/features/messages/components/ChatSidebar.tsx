"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlassIcon as Search,
  ChatBubbleLeftRightIcon as MessageCircleIcon,
  ArrowLeftIcon as ArrowLeft,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMessages } from "../hooks/useMessages";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import type { ChatRoom, ChatParticipantRole, ChatRoomCategory } from "../types/messages.types";
import {
  STAGE_LABELS,
  STAGE_COLORS,
  formatRelativeTime,
} from "../constants/messages.utils";

const STATUS_ROOM_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  CLOSED: "Đã đóng",
  CONVERTED_TO_CLASS: "Tạo lớp học",
};

function RoomRow({
  room,
  currentUserRole,
}: {
  room: ChatRoom;
  currentUserRole: ChatParticipantRole;
}) {
  const isReadOnly = room.status !== "ACTIVE";
  const peer = room.category === "SUPPORT"
    ? room.consultant
    : currentUserRole === "LEARNER" ? room.tutor : room.learner;
  const pathname = usePathname();

  const basePath =
    currentUserRole === "LEARNER" ? "/learner/messages" : "/tutor/messages";

  return (
    <Link
      href={`${basePath}/${room.id}`}
      aria-current={pathname === `${basePath}/${room.id}` ? "page" : undefined}
      className={`group flex items-start gap-3 rounded-xl border px-3 py-3.5 transition ${pathname === `${basePath}/${room.id}` ? "border-primary bg-muted" : "border-transparent hover:border-border hover:bg-muted"}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
          {(room.recipientName || peer.name).split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase() || "BW"}
        </div>
        {peer.isOnline && !isReadOnly && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-secondary" aria-label="Đang trực tuyến" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1">
          <span className="truncate text-sm font-bold text-foreground group-hover:text-primary">
            {room.recipientName || peer.name}
          </span>
          {room.lastMessageAt && (
            <time className="shrink-0 text-[10px] text-muted-foreground">
              {formatRelativeTime(room.lastMessageAt)}
            </time>
          )}
        </div>

        {/* Subject + Stage */}
        {room.hasConnectionDetails && <p className="mb-0.5 text-[11px] text-muted-foreground">{room.subject} {room.gradeLevel}</p>}

        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">
            {room.lastMessage ?? "Mở để xem tin nhắn"}
          </p>
          {room.unreadCount > 0 && (
            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-primary-foreground">
              {room.unreadCount}
            </span>
          )}
        </div>

        {/* Stage badge */}
        {(isReadOnly || room.hasConnectionDetails || room.category === "SUPPORT") && <span
          className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
            room.category === "SUPPORT" && !isReadOnly
              ? "border-secondary/20 bg-secondary/10 text-secondary"
              : isReadOnly
              ? "border-gray-200 bg-gray-100 text-gray-500"
              : (STAGE_COLORS[room.connectionStage] ??
                "bg-gray-100 text-gray-600 border-gray-200")
          }`}
        >
          {room.category === "SUPPORT" && !isReadOnly
            ? "Đang hỗ trợ"
            : isReadOnly
            ? STATUS_ROOM_LABELS[room.status]
            : STAGE_LABELS[room.connectionStage]}
        </span>}
      </div>
    </Link>
  );
}

export function ChatSidebar() {
  const { rooms, loading, error, refetch, fetchNextPage, hasNextPage, fetchingNextPage } = useMessages();
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const currentUserRole = (user?.role?.toUpperCase() ||
    "LEARNER") as ChatParticipantRole;
  const activeRoom = rooms.find((room) => pathname?.endsWith(`/${room.id}`));
  const [category, setCategory] = useState<ChatRoomCategory>(activeRoom?.category ?? "CONNECTION");

  const availableRooms = rooms.filter(
    (room) => room.category === "CONNECTION" || room.supportFor === currentUserRole,
  );
  const normalizedQuery = query.trim().toLowerCase();
  const selectCategory = (nextCategory: ChatRoomCategory) => {
    setCategory(nextCategory);
    setQuery("");
  };

  const filtered = availableRooms.filter(
    (r) =>
      r.category === category && (
      (normalizedQuery === "" ||
      (r.category === "SUPPORT" ? r.consultant.name : currentUserRole === "LEARNER" ? r.tutor.name : r.learner.name)
        .toLowerCase()
        .includes(normalizedQuery) ||
      r.subject.toLowerCase().includes(normalizedQuery) ||
      r.recipientName?.toLowerCase().includes(normalizedQuery))),
  );

  return (
    <aside className="flex h-full w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:w-80">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-4 border-b border-border px-4 py-4">
        {/* Brand */}
        <Link href="/" className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-primary" aria-label="BeeWise - Trang chủ">
          <span className="relative block h-6 w-28">
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"
              alt="BeeWise"
              fill
              sizes="112px"
              className="object-contain object-center"
              priority
            />
          </span>
        </Link>

        {/* Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href={currentUserRole === "LEARNER" ? "/" : "/tutor/home"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition hover:brightness-95"
            aria-label="Quay lại Trang chủ"
          >
            <ArrowLeft width={18} height={18} />
          </Link>
          <div>
            <h2 className="font-nunito text-lg font-extrabold text-foreground">Tin nhắn</h2>
            <p className="text-xs text-muted-foreground">Kết nối cùng gia sư và tư vấn viên</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-border px-3 py-2.5">
        <div className="relative">
          <Search width={14} height={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm người trò chuyện, môn học..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="shrink-0 border-b border-border px-3 py-2.5">
        <div role="group" aria-label="Loại cuộc trò chuyện" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(["CONNECTION", "SUPPORT"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => selectCategory(item)}
              className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-bold transition ${category === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item === "CONNECTION" ? "Kết nối" : "Hỗ trợ"}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${category === item ? "bg-muted text-primary" : "bg-card text-muted-foreground"}`}>
                {availableRooms.filter((room) => room.category === item).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Pinned Demo Room for photoshoot / recording */}
        <Link
          href="/learner/messages/tvc-demo"
          className="group flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 transition hover:border-primary/40 hover:bg-primary/10"
        >
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
              MĐ
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-secondary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-1">
              <span className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                Thầy Trần Minh Đức
              </span>
              <span className="shrink-0 rounded-full bg-secondary/15 px-2 py-0.5 text-[9px] font-bold text-secondary border border-secondary/25">
                Đang hoạt động
              </span>
            </div>
            <p className="text-[10px] font-semibold text-primary truncate">
              Toán 12 - Ôn thi THPT Quốc Gia
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              Thầy đã lên lịch chi tiết cho 10 buổi học...
            </p>
          </div>
        </Link>

        {loading ? <p className="px-4 py-10 text-center text-xs text-muted-foreground">Đang tải cuộc trò chuyện...</p> : error ? <div className="px-4 py-10 text-center text-xs text-muted-foreground"><p role="alert">{getApiErrorMessage(error, "Không tải được danh sách trò chuyện.")}</p><button type="button" onClick={() => void refetch()} className="mt-2 font-semibold text-primary underline">Thử lại</button></div> : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <MessageCircleIcon width={32} height={32} className="mb-3 text-muted-foreground" />
            <strong className="text-sm text-foreground">
              {query ? "Không tìm thấy" : "Chưa có cuộc trò chuyện"}
            </strong>
            <p className="mt-1 text-xs text-muted-foreground">
              {query
                ? "Thử tìm kiếm khác"
                : category === "SUPPORT"
                  ? "Chưa có cuộc trò chuyện hỗ trợ."
                  : "Các cuộc trò chuyện kết nối sẽ hiện tại đây."}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((room) => (
              <RoomRow
                key={room.id}
                room={room}
                currentUserRole={currentUserRole}
              />
            ))}
            {hasNextPage && <button type="button" disabled={fetchingNextPage} onClick={() => void fetchNextPage()} className="w-full rounded-lg py-3 text-xs font-semibold text-primary disabled:opacity-50">{fetchingNextPage ? "Đang tải..." : "Xem thêm cuộc trò chuyện"}</button>}
          </div>
        )}
      </div>
    </aside>
  );
}
