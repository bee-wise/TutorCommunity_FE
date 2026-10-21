"use client";

import Image from "next/image";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationList } from "@workspace/core/hooks/useNotifications";
import { cn } from "@workspace/core/helpers/utils";
import { DASHBOARD_ASSETS } from "../data/dashboard.assets";
import { formatRelativeTime } from "../utils/dashboard-overview.utils";

const VISIBLE_COUNT = 4;

export function DashboardNotifications() {
  const userId = useAuthStore((state) => state.user?.id);
  const list = useNotificationList(userId, false, true);
  const items = (list.data?.pages[0]?.items ?? []).slice(0, VISIBLE_COUNT);
  const unread = items.filter((item) => !item.isRead).length;

  return (
    <section className="sm:col-span-2 xl:col-span-1" aria-labelledby="dashboard-notifications">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="dashboard-notifications" className="font-lms text-sm font-extrabold leading-[1.3] text-foreground">Thông báo</h2>
        {unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold text-primary-foreground">{unread}</span>}
      </div>
      {list.isPending && <p className="mt-3 text-sm text-muted-foreground" role="status">Đang tải thông báo...</p>}
      {list.isError && <p className="mt-3 text-sm text-destructive">Không tải được thông báo. Vui lòng thử lại sau.</p>}
      {!list.isPending && !list.isError && !items.length && (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl bg-muted px-4 py-5 text-center">
          <Image src={DASHBOARD_ASSETS.beeMeditate} alt="" width={96} height={96} unoptimized aria-hidden="true" className="h-16 w-auto" />
          <p className="text-sm font-bold text-foreground">Bạn đã xem hết thông báo</p>
        </div>
      )}
      {items.length > 0 && (
        <ul className="mt-2 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-2.5 py-3">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.isRead ? "bg-border" : "bg-primary")} aria-hidden="true" />
              <div className="min-w-0 space-y-0.5">
                <p className={cn("text-sm text-foreground", !item.isRead && "font-bold")}>{item.title || "Thông báo"}</p>
                {item.content && <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.content}</p>}
                <p className="text-xs tabular-nums text-muted-foreground">{formatRelativeTime(item.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
