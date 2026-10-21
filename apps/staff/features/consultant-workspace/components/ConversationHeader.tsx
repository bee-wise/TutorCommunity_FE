import {
  ArrowLeftIcon as ArrowLeft,
  InformationCircleIcon as Info,
  UserGroupIcon as UsersThree,
  XCircleIcon as XCircle,
  ChevronDoubleLeftIcon as CollapseList,
  ChevronDoubleRightIcon as ExpandList,
} from "@heroicons/react/24/outline";
import { initials } from "../utils/format";
import type { WorkspaceRoom } from "../types/workspace";

export function ConversationHeader({
  room,
  title,
  subtitle,
  readOnly,
  onBack,
  onInfo,
  onClose,
  listCollapsed = false,
  onToggleList,
}: {
  room: WorkspaceRoom;
  title: string;
  subtitle: string;
  readOnly: boolean;
  onBack: () => void;
  onInfo: () => void;
  onClose: () => void;
  listCollapsed?: boolean;
  onToggleList?: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-card px-2.5 py-2 sm:px-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {onToggleList && (
          <button
            type="button"
            onClick={onToggleList}
            aria-label={listCollapsed ? "Mở rộng danh sách phòng" : "Thu gọn danh sách phòng"}
            title={listCollapsed ? "Mở rộng danh sách phòng" : "Thu gọn danh sách phòng"}
            className="hidden size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95 lg:flex"
          >
            {listCollapsed ? <ExpandList width={18} height={18} /> : <CollapseList width={18} height={18} />}
          </button>
        )}
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border bg-card p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-95 lg:hidden"
          aria-label="Quay lại danh sách"
        >
          <ArrowLeft width={18} height={18} />
        </button>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${room.kind === "group" ? "bg-primary text-primary-foreground" : "bg-secondary/15 text-secondary"}`}>
          {room.kind === "group" ? <UsersThree width={18} height={18} /> : initials(title)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-nunito text-sm font-extrabold text-foreground sm:text-base">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex ${readOnly ? "bg-muted text-muted-foreground" : "bg-secondary/15 text-secondary"}`}>
          {readOnly ? "Đã đóng" : "Đang hỗ trợ"}
        </span>
        <button
          type="button"
          onClick={onInfo}
          aria-label="Xem thông tin hỗ trợ"
          title="Xem thông tin hỗ trợ"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-muted hover:text-primary active:scale-95"
        >
          <Info width={16} height={16} className="text-primary" />
          <span className="hidden 2xl:inline">Thông tin hỗ trợ</span>
        </button>
        {!readOnly && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chat"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-destructive/40 hover:bg-muted hover:text-destructive active:scale-95"
          >
            <XCircle width={16} height={16} />
            <span className="hidden 2xl:inline">Đóng chat</span>
          </button>
        )}
      </div>
    </header>
  );
}
