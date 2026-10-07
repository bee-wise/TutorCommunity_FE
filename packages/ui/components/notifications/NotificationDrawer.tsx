"use client";

import { useState } from "react";
import {
  BellIcon,
  ChecksIcon,
  CircleNotchIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";
import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useDeleteNotificationsBatch,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
} from "@workspace/core/hooks/useNotifications";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { cn } from "@workspace/core/helpers/utils";
import { toast } from "../ui/bee-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { NotificationItem } from "./NotificationItem";

type Filter = "all" | "unread";
type DeleteConfirmation = "all" | "selected" | null;

export function NotificationDrawer() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [confirmDelete, setConfirmDelete] = useState<DeleteConfirmation>(null);
  const user = useAuthStore((state) => state.user);
  const isOpen = useNotificationDrawerStore((state) => state.isOpen);
  const closeDrawer = useNotificationDrawerStore((state) => state.closeDrawer);
  const unreadCount = useNotificationDrawerStore((state) => state.unreadCount);
  const userId = user?.id ?? "";
  const list = useNotificationList(user?.id, filter === "unread", isOpen);
  const markRead = useMarkNotificationRead(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);
  const deleteOne = useDeleteNotification(userId);
  const deleteBatch = useDeleteNotificationsBatch(userId);
  const deleteAll = useDeleteAllNotifications(userId);
  const notifications = list.data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const displayedUnreadCount = Math.max(0, unreadCount ?? user?.unreadNotificationCount ?? 0);
  const totalCount = list.data?.pages[0]?.pagination.totalItems ?? notifications.length;
  const allVisibleSelected = notifications.length > 0 && notifications.every((item) => selectedIds.has(item.id));
  const isDeleting = deleteOne.isPending || deleteBatch.isPending || deleteAll.isPending;

  const handleClose = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
    setConfirmDelete(null);
    closeDrawer();
  };

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

  const handleDeleteOne = (id: string) => {
    deleteOne.mutate(id, {
      onSuccess: () => toast.success("Đã xóa thông báo"),
      onError: (error) => toast.error("Chưa thể xóa thông báo", { description: getApiErrorMessage(error) }),
    });
  };

  const toggleSelectionMode = () => {
    setSelectionMode((current) => !current);
    setSelectedIds(new Set());
    setConfirmDelete(null);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) notifications.forEach((item) => next.delete(item.id));
      else notifications.forEach((item) => next.add(item.id));
      return next;
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete || isDeleting) return;
    try {
      const affectedCount = confirmDelete === "all"
        ? await deleteAll.mutateAsync()
        : await deleteBatch.mutateAsync([...selectedIds]);
      toast.success(`Đã xóa ${affectedCount} thông báo`);
      setSelectedIds(new Set());
      setSelectionMode(false);
      setConfirmDelete(null);
    } catch (error) {
      toast.error("Chưa thể xóa thông báo", { description: getApiErrorMessage(error) });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="z-[100] flex h-[100dvh] w-full flex-col gap-0 border-l-0 bg-[#f7f8fc] p-0 sm:max-w-[460px] sm:border-l"
      >
        <SheetHeader className="border-b border-border/70 bg-card px-5 pb-5 pt-6 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_6px_16px_rgba(12,30,170,0.18)]">
              <BellIcon size={22} weight="fill" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="font-nunito text-xl font-extrabold tracking-tight text-foreground">
                Thông báo
              </SheetTitle>
              <SheetDescription className="mt-0.5 text-xs leading-5">
                Cập nhật mới nhất từ BeeWise
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng thông báo"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <XIcon size={18} aria-hidden="true" />
            </button>
          </div>
          {displayedUnreadCount > 0 && (
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-[#765200]">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {displayedUnreadCount} thông báo chưa đọc
            </span>
          )}
        </SheetHeader>

        <div className="border-b border-border/70 bg-card px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 rounded-xl bg-muted/70 p-1" role="group" aria-label="Lọc thông báo">
              {(["all", "unread"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFilter(value);
                    setSelectedIds(new Set());
                    setConfirmDelete(null);
                  }}
                  aria-pressed={filter === value}
                  className={cn(
                    "min-w-0 flex-1 rounded-lg px-2 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    filter === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {value === "all" ? "Tất cả" : "Chưa đọc"}
                </button>
              ))}
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={toggleSelectionMode}
                className="shrink-0 rounded-lg px-2 py-2 text-xs font-bold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {selectionMode ? "Hủy chọn" : "Chọn nhiều"}
              </button>
            )}
          </div>
          {!selectionMode && userId && (displayedUnreadCount > 0 || (filter === "all" && totalCount > 0)) && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={displayedUnreadCount === 0 || markAllRead.isPending}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                {markAllRead.isPending ? <CircleNotchIcon size={15} className="animate-spin" aria-hidden="true" /> : <ChecksIcon size={15} aria-hidden="true" />}
                Đọc tất cả
              </button>
              {filter === "all" && totalCount > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete("all")}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive disabled:opacity-40"
                >
                  <TrashIcon size={15} aria-hidden="true" />
                  Xóa tất cả
                </button>
              )}
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          {!userId ? (
            <EmptyState message="Đăng nhập để xem thông báo của bạn." />
          ) : list.isPending ? (
            <div className="space-y-3" aria-label="Đang tải thông báo">
              {[0, 1, 2].map((index) => <div key={index} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />)}
            </div>
          ) : list.isError && notifications.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">{getApiErrorMessage(list.error, "Không thể tải thông báo.")}</p>
              <button type="button" onClick={() => void list.refetch()} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                Thử lại
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState message={filter === "unread" ? "Bạn đã xem hết các cập nhật mới." : "Các cập nhật mới sẽ xuất hiện ở đây."} />
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
                <span>{totalCount} thông báo</span>
                <span>Mới nhất trước</span>
              </div>
              <div className="space-y-2.5">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isMarking={markRead.isPending && markRead.variables === notification.id}
                    isDeleting={isDeleting}
                    selectionMode={selectionMode}
                    selected={selectedIds.has(notification.id)}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDeleteOne}
                    onToggleSelect={toggleSelected}
                  />
                ))}
              </div>
              {list.hasNextPage && (
                <div className="py-5 text-center">
                  {list.isFetchNextPageError && <p className="mb-2 text-xs text-destructive">Không thể tải thêm thông báo.</p>}
                  <button
                    type="button"
                    onClick={() => void list.fetchNextPage()}
                    disabled={list.isFetchingNextPage}
                    className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-primary shadow-sm hover:border-primary/30 disabled:opacity-50"
                  >
                    {list.isFetchingNextPage ? "Đang tải..." : list.isFetchNextPageError ? "Thử lại" : "Xem thêm"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {selectionMode && notifications.length > 0 && !confirmDelete && (
          <div className="border-t border-border bg-card px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-foreground">Đã chọn {selectedIds.size}</span>
              <button type="button" onClick={toggleAllVisible} className="text-xs font-bold text-primary hover:underline">
                {allVisibleSelected ? "Bỏ chọn tất cả" : "Chọn tất cả đã tải"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setConfirmDelete("selected")}
              disabled={selectedIds.size === 0 || isDeleting}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-destructive text-sm font-bold text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <TrashIcon size={17} aria-hidden="true" />
              Xóa thông báo đã chọn
            </button>
          </div>
        )}

        {confirmDelete && (
          <div className="border-t border-destructive/20 bg-card px-5 py-4 sm:px-6" role="region" aria-label="Xác nhận xóa thông báo" aria-live="polite">
            <p className="font-nunito text-sm font-extrabold text-foreground">
              {confirmDelete === "all" ? "Xóa toàn bộ thông báo?" : `Xóa ${selectedIds.size} thông báo đã chọn?`}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Thao tác này không thể hoàn tác.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setConfirmDelete(null)} disabled={isDeleting} className="h-10 flex-1 rounded-xl border border-border bg-card text-sm font-bold text-foreground disabled:opacity-50">
                Hủy
              </button>
              <button type="button" onClick={() => void handleConfirmDelete()} disabled={isDeleting} className="h-10 flex-1 rounded-xl bg-destructive text-sm font-bold text-destructive-foreground disabled:opacity-50">
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/5 text-primary">
        <BellIcon size={30} weight="duotone" aria-hidden="true" />
      </span>
      <p className="mt-4 font-nunito text-base font-extrabold text-foreground">Chưa có thông báo</p>
      <p className="mt-1 max-w-56 text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}
