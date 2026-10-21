"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlassIcon as Search,
  ChatBubbleLeftRightIcon as MessageCircleIcon,
  ArrowLeftIcon as ArrowLeft,
  ChevronDoubleLeftIcon as CollapseIcon,
  ChevronDoubleRightIcon as ExpandIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMessages } from "../hooks/useMessages";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import type { ChatRoom, ChatParticipantRole } from "../types/messages.types";
import {
  formatRelativeTime,
} from "../constants/messages.utils";

type RoomStatusFilter = "OPEN" | "CLOSED";

// SVG logos are served as-is (no Cloudinary transform), per the asset catalog.
const CLOUDINARY = "https://res.cloudinary.com/xcrm6ykz/image/upload";
const LMS_LOGO_WIDE = `${CLOUDINARY}/v1791535277/BeeWiseLMS-Logo-500x150.svg`;
const LMS_LOGO_SQUARE = `${CLOUDINARY}/v1791535366/BeeWiseLMS-Logo-500x500.svg`;

const STATUS_ROOM_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  CLOSED: "Đã đóng",
  CONVERTED_TO_CLASS: "Tạo lớp học",
};

function RoomRow({
  room,
  currentUserRole,
  compact = false,
}: {
  room: ChatRoom;
  currentUserRole: ChatParticipantRole;
  compact?: boolean;
}) {
  const isReadOnly = room.status !== "ACTIVE";
  const peer = room.category === "SUPPORT"
    ? room.consultant
    : currentUserRole === "LEARNER" ? room.tutor : room.learner;
  const pathname = usePathname();

  const basePath = "/lms/tutor/messages";

  const showBadge = isReadOnly || room.category === "SUPPORT";

  if (compact) {
    return (
      <Link
        href={`${basePath}/${room.id}`}
        aria-current={pathname === `${basePath}/${room.id}` ? "page" : undefined}
        title={peer.name}
        aria-label={peer.name}
        className={`relative mx-auto flex size-12 items-center justify-center rounded-xl border transition-all active:scale-[0.98] ${pathname === `${basePath}/${room.id}` ? "border-primary bg-muted" : "border-transparent hover:border-border hover:bg-muted"}`}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
          {peer.initials}
        </span>
        {room.unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-destructive-foreground">
            {room.unreadCount > 99 ? "99+" : room.unreadCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`${basePath}/${room.id}`}
      aria-current={pathname === `${basePath}/${room.id}` ? "page" : undefined}
      className={`group flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-all active:scale-[0.98] ${pathname === `${basePath}/${room.id}` ? "border-primary bg-muted" : "border-transparent hover:border-border hover:bg-muted"}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
          {peer.initials}
        </div>
        {peer.isOnline && !isReadOnly && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-secondary" aria-label="Đang trực tuyến" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1">
          <span className="truncate text-sm font-bold text-foreground group-hover:text-primary">
            {peer.name}
          </span>
          {room.lastMessageAt && (
            <time className="shrink-0 text-[10px] text-muted-foreground">
              {formatRelativeTime(room.lastMessageAt)}
            </time>
          )}
        </div>

        {/* Subject + Stage */}
        <p className="mb-0.5 text-[11px] text-muted-foreground">
          {room.category === "CONNECTION" ? (room.subject || "Yêu cầu kết nối") : room.subject}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">
            {room.lastMessage ?? "Mở cuộc trò chuyện"}
          </p>
          {room.unreadCount > 0 && (
            <span aria-label={`${room.unreadCount} tin nhắn chưa đọc`} className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-destructive-foreground">
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </span>
          )}
        </div>

        {/* Status badge: only when it adds information (support or read-only rooms) */}
        {showBadge && (
          <span
            className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
              room.category === "SUPPORT" && !isReadOnly
                ? "border-secondary/30 bg-secondary/15 text-foreground"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {room.category === "SUPPORT" && !isReadOnly
              ? "Đang hỗ trợ"
              : STATUS_ROOM_LABELS[room.status]}
          </span>
        )}
      </div>
    </Link>
  );
}

export function ChatSidebar({
  collapsed = false,
  onToggleCollapsed,
}: {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const { rooms, loading, error, refetch } = useMessages({ live: true });
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const currentUserRole: ChatParticipantRole = "TUTOR";
  const activeRoom = rooms.find((room) => pathname?.endsWith(`/${room.id}`));
  const [selectedFilter, setSelectedFilter] = useState<RoomStatusFilter | null>(null);
  const statusFilter: RoomStatusFilter =
    selectedFilter ?? (activeRoom && activeRoom.status !== "ACTIVE" ? "CLOSED" : "OPEN");

  // Connection and support rooms share one list; open = still active, closed = everything else.
  const availableRooms = rooms.filter(
    (room) => room.category === "CONNECTION" || room.supportFor === currentUserRole,
  );
  const openCount = availableRooms.filter((room) => room.status === "ACTIVE").length;
  const closedCount = availableRooms.length - openCount;
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = availableRooms.filter(
    (r) =>
      (statusFilter === "OPEN" ? r.status === "ACTIVE" : r.status !== "ACTIVE") && (
      normalizedQuery === "" ||
      (r.category === "SUPPORT" ? r.consultant.name : r.learner.name)
        .toLowerCase()
        .includes(normalizedQuery) ||
      r.subject.toLowerCase().includes(normalizedQuery)),
  );

  return (
    <aside
      className={`flex h-full w-full shrink-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft ${
        collapsed ? "lg:w-[72px]" : "lg:w-72"
      }`}
    >
      {/* Header: back, title and collapse in one row */}
      <div
        className={`flex shrink-0 items-center gap-2 border-b border-border px-2.5 py-2 ${
          collapsed ? "lg:flex-col lg:py-3" : ""
        }`}
      >
        <Link
          href="/lms/tutor/dashboard"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition-all hover:brightness-95 active:scale-[0.98]"
          aria-label="Quay lại Trang chủ"
          title="Về trang chủ gia sư"
        >
          <ArrowLeft width={18} height={18} />
        </Link>
        <h2 className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
          <Link
            href="/lms/tutor/dashboard"
            aria-label="BeeWise LMS - Tin nhắn"
            className="relative block h-9 w-36 max-w-full"
          >
            <Image
              src={LMS_LOGO_WIDE}
              alt="BeeWise LMS"
              fill
              sizes="144px"
              className="object-contain object-left"
              priority
              unoptimized
            />
          </Link>
        </h2>
        {collapsed && (
          <Link
            href="/lms/tutor/dashboard"
            aria-label="BeeWise LMS - Trang chủ"
            className="relative hidden size-10 shrink-0 lg:block"
          >
            <Image
              src={LMS_LOGO_SQUARE}
              alt="BeeWise LMS"
              fill
              sizes="40px"
              className="object-contain"
              unoptimized
            />
          </Link>
        )}
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Mở rộng danh sách" : "Thu gọn danh sách"}
            title={collapsed ? "Mở rộng danh sách" : "Thu gọn danh sách"}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-[0.98] lg:flex"
          >
            {collapsed ? (
              <ExpandIcon width={18} height={18} />
            ) : (
              <CollapseIcon width={18} height={18} />
            )}
          </button>
        )}
      </div>

      {/* Search + category tabs share one compact block (hidden in the collapsed rail) */}
      <div
        className={`shrink-0 space-y-2 border-b border-border px-2.5 py-2 ${
          collapsed ? "lg:hidden" : ""
        }`}
      >
        <div className="relative">
          <Search width={14} height={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm học viên, tư vấn viên, môn học..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div role="group" aria-label="Lọc theo trạng thái cuộc trò chuyện" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(
            [
              ["OPEN", "Đang mở", openCount],
              ["CLOSED", "Đã đóng", closedCount],
            ] as const
          ).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              aria-pressed={statusFilter === value}
              onClick={() => setSelectedFilter(value)}
              className={`flex items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold transition-all active:scale-[0.98] ${statusFilter === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === value ? "bg-muted text-primary" : "bg-card text-muted-foreground"}`}>
                {count}
              </span>
              {availableRooms.some(
                (room) =>
                  (value === "OPEN" ? room.status === "ACTIVE" : room.status !== "ACTIVE") &&
                  room.unreadCount > 0,
              ) && (
                <span className="h-2 w-2 rounded-full bg-destructive" aria-label="Có tin nhắn chưa đọc" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <p className="px-4 py-12 text-center text-sm text-muted-foreground">Đang tải cuộc trò chuyện...</p>
        ) : error ? (
          <div role="alert" className="px-4 py-12 text-center text-sm text-destructive">
            <p>{getApiErrorMessage(error)}</p>
            <button type="button" onClick={() => void refetch()} className="mt-3 rounded-lg border border-border bg-background px-3 py-1.5 font-semibold text-primary transition-all hover:bg-muted active:scale-[0.98]">Thử lại</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <MessageCircleIcon width={32} height={32} className="mb-3 text-muted-foreground" />
            <strong className={`text-sm text-foreground ${collapsed ? "lg:hidden" : ""}`}>
              {query ? "Không tìm thấy" : "Chưa có cuộc trò chuyện"}
            </strong>
            <p className={`mt-1 text-xs text-muted-foreground ${collapsed ? "lg:hidden" : ""}`}>
              {query
                ? "Thử tìm kiếm khác"
                : statusFilter === "CLOSED"
                  ? "Chưa có cuộc trò chuyện nào đã đóng."
                  : "Các cuộc trò chuyện đang mở sẽ hiện tại đây."}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((room) => (
              <RoomRow
                key={room.id}
                room={room}
                currentUserRole={currentUserRole}
                compact={collapsed}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
