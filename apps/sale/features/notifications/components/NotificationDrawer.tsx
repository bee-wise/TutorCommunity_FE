"use client";

import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";
import { useNotificationStore } from "../store/useNotificationStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/ui/sheet";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@workspace/ui/components/ui/button";
import { CheckCheck, BellRing } from "lucide-react";
import { cn } from "@workspace/core/helpers/utils";

export function NotificationDrawer() {
  const { isOpen, closeDrawer } = useNotificationDrawerStore();
  const filter = useNotificationStore(state => state.filter);
  const setFilter = useNotificationStore(state => state.setFilter);
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
  const getFilteredNotifications = useNotificationStore(state => state.getFilteredNotifications);
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount);

  const notifications = getFilteredNotifications();
  const unreadCount = getUnreadCount();

  return (
    <Sheet open={isOpen} onOpenChange={closeDrawer}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l-0 sm:border-l z-[100]">
        <SheetHeader className="p-4 border-b flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-primary font-bold">
            <BellRing className="size-5 text-accent" />
            Thông báo
            {unreadCount > 0 && (
              <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                {unreadCount} mới
              </span>
            )}
          </SheetTitle>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <CheckCheck className="size-4 mr-1" />
            Đánh dấu đã đọc
          </Button>
        </SheetHeader>

        {/* Custom Tabs */}
        <div className="flex items-center gap-1 p-2 border-b bg-muted/10">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors",
              filter === "all" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "flex-1 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors",
              filter === "unread" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            Chưa đọc
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="flex flex-col pb-4">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onCloseDrawer={closeDrawer}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground space-y-4">
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
                <BellRing className="size-8 text-muted-foreground/30" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Không có thông báo nào</p>
                <p className="text-sm mt-1">
                  {filter === "unread" 
                    ? "Bạn đã đọc tất cả thông báo." 
                    : "Bạn chưa có thông báo nào mới."}
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
