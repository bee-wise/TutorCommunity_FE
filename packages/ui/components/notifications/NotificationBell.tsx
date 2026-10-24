"use client";

import { Bell } from "lucide-react";
import { cn } from "@workspace/core/helpers/utils";

/**
 * Header bell with an unread badge. While there are unread items the bell
 * shakes periodically, and `key={count}` restarts the shake on every new
 * notification. Motion is disabled for `prefers-reduced-motion`.
 */
export function NotificationBell({
  count,
  onClick,
  className,
  iconClassName,
  ringClassName = "ring-card",
}: {
  count: number;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
  /** Ring color that should match the header background behind the badge. */
  ringClassName?: string;
}) {
  const unread = Math.max(0, count);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo"}
      className={cn(
        "relative inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
        className,
      )}
    >
      <Bell
        key={unread}
        aria-hidden="true"
        className={cn(
          "size-5",
          unread > 0 && "bell-ring fill-current text-accent",
          iconClassName,
        )}
      />
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-60 motion-reduce:hidden" />
          <span
            className={cn(
              "relative flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-extrabold leading-none text-destructive-foreground tabular-nums ring-2",
              ringClassName,
            )}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        </span>
      )}
    </button>
  );
}
