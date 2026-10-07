import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { BellIcon, CheckIcon, TrashIcon } from "@phosphor-icons/react";
import type { Notification } from "@workspace/core/services/notifications.service";
import { cn } from "@workspace/core/helpers/utils";

interface NotificationItemProps {
  notification: Notification;
  isMarking: boolean;
  isDeleting: boolean;
  selectionMode: boolean;
  selected: boolean;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

export function NotificationItem({
  notification,
  isMarking,
  isDeleting,
  selectionMode,
  selected,
  onMarkRead,
  onDelete,
  onToggleSelect,
}: NotificationItemProps) {
  const createdAt = new Date(notification.createdAt);
  const relativeTime = Number.isNaN(createdAt.getTime())
    ? "Vừa xong"
    : formatDistanceToNow(createdAt, { addSuffix: true, locale: vi });
  const title = notification.title?.trim() || "Thông báo từ BeeWise";

  return (
    <article
      className={cn(
        "relative flex gap-3 overflow-hidden rounded-2xl border bg-card p-4 shadow-[0_3px_16px_rgba(12,30,170,0.035)] transition-colors",
        notification.isRead ? "border-border/80" : "border-primary/20",
        selected && "border-primary bg-primary/5 ring-1 ring-primary/20",
      )}
    >
      {!notification.isRead && (
        <span className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-accent" aria-hidden="true" />
      )}
      {selectionMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(notification.id)}
          aria-label={`Chọn thông báo: ${title}`}
          className="mt-2 size-4 shrink-0 accent-primary"
        />
      )}
      <span className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl",
        notification.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
      )}>
        <BellIcon size={19} weight={notification.isRead ? "regular" : "fill"} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className={cn(
            "min-w-0 flex-1 font-nunito text-sm leading-5",
            notification.isRead ? "font-bold text-foreground/80" : "font-extrabold text-foreground",
          )}>
            {title}
          </h3>
          {!notification.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-label="Chưa đọc" />}
        </div>
        {notification.content?.trim() && (
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-muted-foreground">
            {notification.content}
          </p>
        )}
        <div className="mt-3 flex min-h-6 items-center justify-between gap-2">
          <time dateTime={notification.createdAt} className="text-xs text-muted-foreground">
            {relativeTime}
          </time>
          {!selectionMode && (
            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <button
                  type="button"
                  onClick={() => onMarkRead(notification.id)}
                  disabled={isMarking || isDeleting}
                  aria-label={`Đánh dấu đã đọc: ${title}`}
                  title="Đánh dấu đã đọc"
                  className="flex size-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                >
                  <CheckIcon size={17} weight="bold" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(notification.id)}
                disabled={isMarking || isDeleting}
                aria-label={`Xóa thông báo: ${title}`}
                title="Xóa thông báo"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-50"
              >
                <TrashIcon size={17} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
