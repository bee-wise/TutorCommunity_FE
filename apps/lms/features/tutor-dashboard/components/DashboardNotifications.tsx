"use client";
import { CaretDown } from "@phosphor-icons/react";
import { DEMO_NOTIFICATIONS } from "../data/dashboard.data";

function Notification({ item }: { item: (typeof DEMO_NOTIFICATIONS)[number] }) {
  return (
    <li className="space-y-1 py-4">
      <p className="font-bold text-foreground">{item.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.content}
      </p>
      <p className="pt-1 text-xs text-muted-foreground">{item.time}</p>
    </li>
  );
}

export function DashboardNotifications() {
  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6"
      aria-labelledby="dashboard-notifications"
    >
      <h2
        id="dashboard-notifications"
        className="text-xl leading-[1.25] text-primary"
      >
        Thông báo gần đây
      </h2>
      <ul className="mt-2 divide-y divide-border">
        {DEMO_NOTIFICATIONS.slice(0, 2).map((item) => (
          <Notification key={item.id} item={item} />
        ))}
      </ul>
      <details className="group mt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-2 py-2 text-sm font-bold text-primary transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">
            Xem tất cả thông báo ({DEMO_NOTIFICATIONS.length})
          </span>
          <span className="hidden group-open:inline">Thu gọn danh sách</span>
          <CaretDown
            size={16}
            weight="bold"
            className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <ul className="divide-y divide-border border-t border-border">
          {DEMO_NOTIFICATIONS.slice(2).map((item) => (
            <Notification key={item.id} item={item} />
          ))}
        </ul>
      </details>
    </section>
  );
}
