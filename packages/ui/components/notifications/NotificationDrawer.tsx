"use client";

import { useState } from "react";
import { BellRing, CheckCheck } from "lucide-react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
} from "@workspace/core/hooks/useNotifications";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { cn } from "@workspace/core/helpers/utils";
import { toast } from "../ui/bee-toast";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { NotificationItem } from "./NotificationItem";

type Filter = "all" | "unread";

export function NotificationDrawer() {
  const [filter, setFilter] = useState<Filter>("all");
  const user = useAuthStore((state) => state.user);
  const isOpen = useNotificationDrawerStore((state) => state.isOpen);
  const closeDrawer = useNotificationDrawerStore((state) => state.closeDrawer);
  const unreadCount = useNotificationDrawerStore((state) => state.unreadCount);
  const userId = user?.id ?? "";
  const list = useNotificationList(user?.id, filter === "unread", isOpen);
  const markRead = useMarkNotificationRead(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);
  const notifications = list.data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const displayedUnreadCount = unreadCount ?? user?.unreadNotificationCount ?? 0;

  const handleMarkRead = (id: string) => {
    markRead.mutate(id, {
      onError: (error) => toast.error("Chưa thể đánh dấu đã đọc", { description: getApiErrorMessage(error) }),
    });
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onError: (error) => toast.error("Chưa thể đánh dấu tất cả đã đọc", { description: getApiErrorMessage(error) }),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeDrawer(); }}>
      <SheetContent side="right" className="z-[100] flex w-full flex-col border-l-0 p-0 sm:max-w-md sm:border-l">
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b p-4">
          <SheetTitle className="flex items-center gap-2 font-bold text-primary">
            <BellRing className="size-5 text-accent" aria-hidden="true" />
            Thông báo
            {displayedUnreadCount > 0 && (
              <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                {displayedUnreadCount} mới
              </span>
            )}
          </SheetTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={!userId || displayedUnreadCount === 0 || markAllRead.isPending}
            className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <CheckCheck className="mr-1 size-4" aria-hidden="true" />
            {markAllRead.isPending ? "Đang cập nhật..." : "Đánh dấu đã đọc"}
          </Button>
        </SheetHeader>

        <div className="flex items-center gap-1 border-b bg-muted/10 p-2" role="group" aria-label="Lọc thông báo">
          {(["all", "unread"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "flex-1 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors",
                filter === value
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              {value === "all" ? "Tất cả" : "Chưa đọc"}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!userId ? (
            <EmptyState message="Đăng nhập để xem thông báo của bạn." />
          ) : list.isPending ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Đang tải thông báo...</div>
          ) : list.isError && notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center text-sm text-muted-foreground">
              <p>{getApiErrorMessage(list.error, "Không thể tải thông báo.")}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void list.refetch()}>
                Thử lại
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState message={filter === "unread" ? "Bạn đã đọc tất cả thông báo." : "Bạn chưa có thông báo nào."} />
          ) : (
            <div className="pb-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isMarking={markRead.isPending && markRead.variables === notification.id}
                  onMarkRead={handleMarkRead}
                />
              ))}
              {list.hasNextPage && (
                <div className="p-4 text-center">
                  {list.isFetchNextPageError && (
                    <p className="mb-2 text-xs text-destructive">Không thể tải thêm thông báo.</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void list.fetchNextPage()}
                    disabled={list.isFetchingNextPage}
                  >
                    {list.isFetchingNextPage ? "Đang tải..." : list.isFetchNextPageError ? "Thử lại" : "Xem thêm"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
        <BellRing className="size-8 text-muted-foreground/30" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-foreground">Không có thông báo nào</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
}
