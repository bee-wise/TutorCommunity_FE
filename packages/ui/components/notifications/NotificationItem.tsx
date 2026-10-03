import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Bell, Check } from "lucide-react";
import type { Notification } from "@workspace/core/services/notifications.service";
import { cn } from "@workspace/core/helpers/utils";
import { Button } from "../ui/button";

interface NotificationItemProps {
  notification: Notification;
  isMarking: boolean;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, isMarking, onMarkRead }: NotificationItemProps) {
  const createdAt = new Date(notification.createdAt);
  const relativeTime = Number.isNaN(createdAt.getTime())
    ? "Vừa xong"
    : formatDistanceToNow(createdAt, { addSuffix: true, locale: vi });

  return (
    <article className={cn(
      "group relative flex items-start gap-3 border-b p-4 last:border-b-0",
      !notification.isRead && "bg-primary/5",
    )}>
      {!notification.isRead && (
        <span className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent" />
      )}
      <span className="ml-2 mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
        <Bell className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 pr-7">
        <h3 className={cn(
          "text-sm font-semibold leading-tight",
          notification.isRead ? "text-muted-foreground" : "text-foreground",
        )}>
          {notification.title?.trim() || "Thông báo"}
        </h3>
        {notification.content && (
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
            {notification.content}
          </p>
        )}
        <time dateTime={notification.createdAt} className="mt-2 block text-[11px] text-muted-foreground">
          {relativeTime}
        </time>
      </div>
      {!notification.isRead && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 size-7 text-muted-foreground hover:text-primary"
          onClick={() => onMarkRead(notification.id)}
          disabled={isMarking}
          aria-label="Đánh dấu thông báo đã đọc"
          title="Đánh dấu đã đọc"
        >
          <Check className="size-4" aria-hidden="true" />
        </Button>
      )}
    </article>
  );
}
