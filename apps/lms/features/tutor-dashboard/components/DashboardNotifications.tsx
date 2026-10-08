import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { DEMO_NOTIFICATIONS } from "../data/dashboard.data";

function Notification({ item }: { item: (typeof DEMO_NOTIFICATIONS)[number] }) {
  return (
    <li className="space-y-1 py-4">
      <p className="text-sm font-bold text-foreground">{item.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{item.content}</p>
      <p className="pt-1 text-xs text-muted-foreground">{item.time} (minh họa)</p>
    </li>
  );
}

export function DashboardNotifications() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6" aria-labelledby="dashboard-notifications">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="dashboard-notifications" className="font-nunito text-xl font-extrabold leading-[1.3] text-primary">Thông báo</h2>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-bold text-primary">{DEMO_NOTIFICATIONS.length} thông báo mẫu</span>
      </div>
      <ul className="mt-2 divide-y divide-border">
        {DEMO_NOTIFICATIONS.slice(0, 2).map((item) => <Notification key={item.id} item={item} />)}
      </ul>
      {DEMO_NOTIFICATIONS.length > 2 && <details className="group mt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-muted/40 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Xem thêm thông báo</span>
          <span className="hidden group-open:inline">Thu gọn</span>
          <ChevronDownIcon className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <ul className="divide-y divide-border">{DEMO_NOTIFICATIONS.slice(2).map((item) => <Notification key={item.id} item={item} />)}</ul>
      </details>}
    </section>
  );
}
