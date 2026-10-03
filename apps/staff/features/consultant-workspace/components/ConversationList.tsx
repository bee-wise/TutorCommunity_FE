"use client";

import {
  LockKeyhole,
  MessageCircleMore,
  Search,
  UsersRound,
} from "lucide-react";
import { formatWorkspaceTime, initials } from "../utils/format";
import { participantName, type WorkspaceRoom } from "../types/workspace";

export type StatusFilter = "ACTIVE" | "CLOSED" | "ALL";
export type ChatKind = "group" | "private";

interface ConversationListProps {
  rooms: WorkspaceRoom[];
  selectedId?: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
  kind: ChatKind;
  onKindChange: (kind: ChatKind) => void;
  groupUnreadCount?: number;
  privateUnreadCount?: number;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  activeCount: number;
  closedCount: number;
  totalCount: number;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  isPreview: boolean;
}

export function ConversationList({
  rooms,
  selectedId,
  query,
  onQueryChange,
  onSelect,
  kind,
  onKindChange,
  groupUnreadCount = 0,
  privateUnreadCount = 0,
  status,
  onStatusChange,
  activeCount,
  closedCount,
  totalCount,
  loading,
  error,
  onRetry,
  isPreview,
}: ConversationListProps) {
  const statusTabs: [StatusFilter, string, number][] = [
    ["ACTIVE", "Đang mở", activeCount],
    ["CLOSED", "Đã đóng", closedCount],
    ["ALL", "Tất cả", totalCount],
  ];

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="border-b border-border/80 p-3.5 sm:p-4">
        {/* Hình thức trò chuyện */}
        <div
          role="group"
          aria-label="Hình thức trò chuyện"
          className="mb-3.5 flex w-full items-center rounded-xl bg-muted/70 p-1"
        >
          <button
            type="button"
            aria-pressed={kind === "group"}
            onClick={() => onKindChange("group")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition ${
              kind === "group"
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UsersRound className="size-3.5" />
            <span>Chat 3 bên</span>
            {groupUnreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white shadow-xs">
                {groupUnreadCount > 99 ? "99+" : groupUnreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-pressed={kind === "private"}
            onClick={() => onKindChange("private")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition ${
              kind === "private"
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircleMore className="size-3.5" />
            <span>Chat riêng</span>
            {privateUnreadCount > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white shadow-xs">
                {privateUnreadCount > 99 ? "99+" : privateUnreadCount}
              </span>
            ) : (
              <span className="rounded bg-amber-500/10 px-1 text-[9px] text-amber-700 dark:text-amber-400">
                Mock
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-nunito text-base font-extrabold text-foreground">
              Cuộc trò chuyện
            </h2>
            <p className="text-xs text-muted-foreground">
              {isPreview
                ? "Bản xem thử chat riêng"
                : "Phòng kết nối bạn tham gia"}
            </p>
          </div>
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-primary">
            {rooms.length}
          </span>
        </div>

        <div className="relative mt-3">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Tìm cuộc trò chuyện</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm học viên, gia sư..."
            className="w-full rounded-xl border border-input bg-muted/40 py-2 pl-9 pr-3 text-xs outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div
          role="group"
          aria-label="Lọc trạng thái"
          className="mt-3 flex items-center gap-1 rounded-xl bg-muted/60 p-1 text-xs font-semibold"
        >
          {statusTabs.map(([val, label, count]) => {
            const active = status === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => onStatusChange(val)}
                aria-pressed={active}
                className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-bold transition ${
                  active
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}{" "}
                <span className="font-normal opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto p-2"
        aria-label="Danh sách cuộc trò chuyện"
      >
        {loading && !isPreview ? (
          <p className="px-4 py-10 text-center text-xs text-muted-foreground">
            Đang tải cuộc trò chuyện...
          </p>
        ) : null}

        {error && !isPreview ? (
          <div className="px-4 py-10 text-center text-xs text-muted-foreground">
            <p>Không tải được danh sách phòng chat.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 font-semibold text-primary underline"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!loading && !error && rooms.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <MessageCircleMore
              className="mb-3 size-8 text-muted-foreground/60"
              aria-hidden="true"
            />
            <strong className="text-sm font-bold">
              {query
                ? "Không tìm thấy cuộc trò chuyện"
                : "Chưa có cuộc trò chuyện"}
            </strong>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {query
                ? "Thử tên khác hoặc chuyển tab bộ lọc."
                : "Phòng chat mới sẽ xuất hiện tại đây."}
            </p>
          </div>
        ) : null}

        {rooms.map((room) => {
          const learner = participantName(room, "LEARNER");
          const tutor = participantName(room, "TUTOR");
          const peer =
            room.kind === "private"
              ? room.participants.find(
                  (person) => person.role !== "CONSULTANT",
                )
              : null;
          const title =
            room.kind === "group" ? learner : peer?.name ?? "Người tham gia";
          const subtitle =
            room.kind === "group"
              ? `Với ${tutor}`
              : peer?.role === "TUTOR"
                ? "Hỗ trợ gia sư"
                : "Hỗ trợ học viên";
          const active = selectedId === room.id;
          const hasUnread = (room.unreadCount ?? 0) > 0;

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelect(room.id)}
              aria-current={active ? "true" : undefined}
              className={`mb-1.5 flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                active
                  ? "border-primary/30 bg-primary/8 shadow-xs"
                  : "border-transparent hover:border-border hover:bg-muted/50"
              }`}
            >
              <span
                className={`relative flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                  room.kind === "group"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/15 text-secondary"
                }`}
              >
                {room.kind === "group" ? (
                  <UsersRound className="size-5" aria-hidden="true" />
                ) : (
                  initials(title)
                )}
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white shadow-xs">
                    {room.unreadCount! > 9 ? "9+" : room.unreadCount}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <strong className="truncate text-xs font-bold text-foreground sm:text-sm">
                    {title}
                  </strong>
                  <time className="shrink-0 text-[10px] text-muted-foreground">
                    {formatWorkspaceTime(room.updatedAt)}
                  </time>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {subtitle}
                </span>
                <span className="mt-2 flex items-center justify-between gap-1.5 text-[10px] font-semibold">
                  <span className="flex items-center gap-1.5">
                    {room.status === "ACTIVE" ? (
                      <span className="rounded-md bg-secondary/10 px-1.5 py-0.5 text-secondary">
                        Đang hỗ trợ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">
                        <LockKeyhole className="size-3" /> Đã đóng
                      </span>
                    )}
                    {room.isMock ? (
                      <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-amber-700 dark:text-amber-400">
                        Minh họa
                      </span>
                    ) : null}
                  </span>

                  {hasUnread && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs">
                      {room.unreadCount! > 99 ? "99+" : room.unreadCount}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
