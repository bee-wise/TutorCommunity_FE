import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, Info, Bell, GraduationCap, CreditCard, Trash2 } from "lucide-react";
import Link from "next/link";
import { Notification, useNotificationStore } from "../store/useNotificationStore";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/core/helpers/utils";
import React from "react";

interface NotificationItemProps {
  notification: Notification;
  onCloseDrawer: () => void;
}

export function NotificationItem({ notification, onCloseDrawer }: NotificationItemProps) {
  const markAsRead = useNotificationStore(state => state.markAsRead);
  const deleteNotification = useNotificationStore(state => state.deleteNotification);

  const handleNotificationClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onCloseDrawer();
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "system": return <Info className="size-4 text-blue-500" />;
      case "course": return <GraduationCap className="size-4 text-green-500" />;
      case "tutor": return <Bell className="size-4 text-amber-500" />;
      case "payment": return <CreditCard className="size-4 text-purple-500" />;
      default: return <Bell className="size-4" />;
    }
  };

  // We conditionally render the wrapper to avoid wrapping a non-link in an anchor tag
  const Wrapper = notification.link ? Link : "div";
  const wrapperProps = notification.link 
    ? { href: notification.link, onClick: handleNotificationClick } 
    : { onClick: handleNotificationClick, className: "cursor-pointer" };

  return (
    <div className={cn("group relative flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-0", !notification.isRead && "bg-primary/5")}>
      {/* Unread indicator */}
      {!notification.isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-accent" />
      )}

      {/* Avatar or Icon */}
      <div className="shrink-0 pt-1 ml-2">
        {notification.avatar ? (
          <Avatar className="size-9 border border-border/50">
            <AvatarImage src={notification.avatar} alt={notification.title} />
            <AvatarFallback className="bg-accent/10 text-xs text-accent-foreground font-semibold">
              {notification.title.substring(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-background border border-border shadow-sm">
            {getIcon(notification.type)}
          </div>
        )}
      </div>

      {/* Content */}
      <Wrapper {...(wrapperProps as any)} className="flex-1 flex flex-col gap-0.5 pr-6 min-w-0">
        <h4 className={cn("text-sm font-semibold leading-tight truncate", !notification.isRead ? "text-foreground" : "text-muted-foreground")}>
          {notification.title}
        </h4>
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-snug">
          {notification.message}
        </p>
        <span className="text-[11px] font-medium text-muted-foreground/60 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
        </span>
      </Wrapper>

      {/* Actions */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
        {!notification.isRead && (
          <Button variant="ghost" size="icon" className="size-6 h-6 w-6 text-muted-foreground hover:text-accent hover:bg-accent/10" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }} title="Đánh dấu đã đọc">
            <Check className="size-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="size-6 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} title="Xóa thông báo">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
