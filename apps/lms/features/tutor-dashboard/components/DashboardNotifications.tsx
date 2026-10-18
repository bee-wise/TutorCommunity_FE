import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { DEMO_NOTIFICATIONS } from "../data/dashboard.data";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@workspace/ui/components/ui/collapsible";

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
    <section className="sm:col-span-2 xl:col-span-1" aria-labelledby="dashboard-notifications">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="dashboard-notifications" className="font-lms text-sm font-extrabold leading-[1.3] text-foreground">Thông báo</h2>
        <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">{DEMO_NOTIFICATIONS.length} mẫu</span>
      </div>
      <ul className="mt-2 divide-y divide-border">
        {DEMO_NOTIFICATIONS.slice(0, 2).map((item) => <Notification key={item.id} item={item} />)}
      </ul>
      {DEMO_NOTIFICATIONS.length > 2 && <Collapsible className="group mt-2">
        <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="group-data-[state=open]:hidden">Xem thêm thông báo</span>
          <span className="hidden group-data-[state=open]:inline">Thu gọn</span>
          <ChevronDownIcon className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsibleContent><ul className="divide-y divide-border">{DEMO_NOTIFICATIONS.slice(2).map((item) => <Notification key={item.id} item={item} />)}</ul></CollapsibleContent>
      </Collapsible>}
    </section>
  );
}
