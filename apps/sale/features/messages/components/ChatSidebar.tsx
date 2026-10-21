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
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import type {
  ChatRoom,
  ChatParticipantRole,
} from "../types/messages.types";
import {
  STAGE_LABELS,
  STAGE_COLORS,
  formatRelativeTime,
  saveLastActiveChatRoomId,
} from "../constants/messages.utils";

type RoomStatusFilter = "OPEN" | "CLOSED";

const CLOUDINARY = "https://res.cloudinary.com/xcrm6ykz/image/upload";
const BEEWISE_LOGO_FULL = `${CLOUDINARY}/e_trim/f_auto,q_auto,w_256/v1790065308/Logo_2.png`;
const BEEWISE_LOGO_MARK = `${CLOUDINARY}/e_trim/f_auto,q_auto,w_72/v1789964842/Logo_1.png`;

const STATUS_ROOM_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Tạm ngưng",
  CLOSED: "Đã đóng",
  CONVERTED_TO_CLASS: "Đã tạo lớp",
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
  const isReadOnly = room.status === "CLOSED" || room.status === "INACTIVE";
  const peer =
    room.category === "SUPPORT"
      ? room.consultant
      : currentUserRole === "LEARNER"
        ? room.tutor
        : room.learner;
  const pathname = usePathname();

  const basePath =
    currentUserRole === "LEARNER" ? "/learner/messages" : "/tutor/messages";

  const peerName = room.recipientName || peer.name;
  const showBadge =
    isReadOnly ||
    room.status === "CONVERTED_TO_CLASS" ||
    room.category === "SUPPORT";

  if (compact) {
    return (
      <Link
        href={`${basePath}/${room.id}`}
        onClick={() => saveLastActiveChatRoomId(room.id, currentUserRole)}
        aria-current={pathname === `${basePath}/${room.id}` ? "page" : undefined}
        title={peerName}
        aria-label={peerName}
        className={`relative mx-auto flex size-12 items-center justify-center rounded-xl border transition ${pathname === `${basePath}/${room.id}` ? "border-primary bg-muted" : "border-transparent hover:border-border hover:bg-muted"}`}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-xs font-black text-primary-foreground">
          {peerName
            .split(/\s+/)
            .filter(Boolean)
            .slice(-2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "BW"}
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
      onClick={() => saveLastActiveChatRoomId(room.id, currentUserRole)}
      aria-current={pathname === `${basePath}/${room.id}` ? "page" : undefined}
      className={`group flex items-start gap-3 rounded-xl border px-3 py-2.5 transition ${pathname === `${basePath}/${room.id}` ? "border-primary bg-muted" : "border-transparent hover:border-border hover:bg-muted"}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
          {(room.recipientName || peer.name)
            .split(/\s+/)
            .filter(Boolean)
            .slice(-2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "BW"}
        </div>
        {peer.isOnline && !isReadOnly && (
          <span
            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-secondary"
            aria-label="Đang trực tuyến"
          />
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
        {room.hasConnectionDetails && (
          <p className="mb-0.5 text-[11px] text-muted-foreground">
            {room.subject} {room.gradeLevel}
          </p>
        )}

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
        {showBadge && (
          <span
            className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
              room.category === "SUPPORT" && !isReadOnly
                ? "border-secondary/20 bg-secondary/10 text-secondary"
                : room.status === "CONVERTED_TO_CLASS"
                  ? "border-secondary/20 bg-secondary/10 text-secondary"
                  : isReadOnly
                    ? "border-gray-200 bg-gray-100 text-gray-500"
                    : (STAGE_COLORS[room.connectionStage] ??
                      "bg-gray-100 text-gray-600 border-gray-200")
            }`}
          >
            {room.category === "SUPPORT" && !isReadOnly
              ? "Đang hỗ trợ"
              : room.status === "CONVERTED_TO_CLASS"
                ? STATUS_ROOM_LABELS.CONVERTED_TO_CLASS
                : isReadOnly
                  ? STATUS_ROOM_LABELS[room.status]
                  : STAGE_LABELS[room.connectionStage]}
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
  const {
    rooms,
    loading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    fetchingNextPage,
  } = useMessages();
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const currentUserRole = (user?.role?.toUpperCase() ||
    "LEARNER") as ChatParticipantRole;
  const activeRoom = rooms.find((room) => pathname?.endsWith(`/${room.id}`));
  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>(
    activeRoom && activeRoom.status !== "ACTIVE" ? "CLOSED" : "OPEN",
  );

  // Connection and support rooms share one list; open = still active, closed = everything else.
  const availableRooms = rooms.filter(
    (room) =>
      room.category === "CONNECTION" || room.supportFor === currentUserRole,
  );
  const openCount = availableRooms.filter((room) => room.status === "ACTIVE").length;
  const closedCount = availableRooms.length - openCount;
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = availableRooms.filter(
    (r) =>
      (statusFilter === "OPEN" ? r.status === "ACTIVE" : r.status !== "ACTIVE") &&
      (normalizedQuery === "" ||
        (r.category === "SUPPORT"
          ? r.consultant.name
          : currentUserRole === "LEARNER"
            ? r.tutor.name
            : r.learner.name
        )
          .toLowerCase()
          .includes(normalizedQuery) ||
        r.subject.toLowerCase().includes(normalizedQuery) ||
        r.recipientName?.toLowerCase().includes(normalizedQuery)),
  );


  return (
    <aside
      className={`flex h-full w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${
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
          href={currentUserRole === "LEARNER" ? "/" : "/tutor/home"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition hover:brightness-95"
          aria-label="Quay lại Trang chủ"
          title="Về trang chủ BeeWise"
        >
          <ArrowLeft width={18} height={18} />
        </Link>
        <h2 className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
          <Link
            href="/"
            aria-label="BeeWise - Tin nhắn"
            className="relative block h-8 w-32 max-w-full"
          >
            <Image
              src={BEEWISE_LOGO_FULL}
              alt="BeeWise"
              fill
              sizes="128px"
              className="object-contain object-left"
              priority
            />
          </Link>
        </h2>
        {collapsed && (
          <Link
            href="/"
            aria-label="BeeWise - Trang chủ"
            className="relative hidden size-9 shrink-0 lg:block"
          >
            <Image
              src={BEEWISE_LOGO_MARK}
              alt="BeeWise"
              fill
              sizes="36px"
              className="object-contain"
            />
          </Link>
        )}
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Mở rộng danh sách" : "Thu gọn danh sách"}
            title={collapsed ? "Mở rộng danh sách" : "Thu gọn danh sách"}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-primary lg:flex"
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
          <Search
            width={14}
            height={14}
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
        <div
          role="group"
          aria-label="Lọc theo trạng thái cuộc trò chuyện"
          className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
        >
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
              onClick={() => setStatusFilter(value)}
              className={`flex items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold transition ${statusFilter === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === value ? "bg-muted text-primary" : "bg-card text-muted-foreground"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {loading ? (
          <p className="px-4 py-10 text-center text-xs text-muted-foreground">
            Đang tải cuộc trò chuyện...
          </p>
        ) : error ? (
          <div className="px-4 py-10 text-center text-xs text-muted-foreground">
            <p role="alert">
              {getApiErrorMessage(
                error,
                "Không tải được danh sách trò chuyện.",
              )}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 font-semibold text-primary underline"
            >
              Thử lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <MessageCircleIcon
              width={32}
              height={32}
              className="mb-3 text-muted-foreground"
            />
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
            {hasNextPage && !collapsed && (
              <button
                type="button"
                disabled={fetchingNextPage}
                onClick={() => void fetchNextPage()}
                className="w-full rounded-lg py-3 text-xs font-semibold text-primary disabled:opacity-50"
              >
                {fetchingNextPage ? "Đang tải..." : "Xem thêm cuộc trò chuyện"}
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
