import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardSchedule } from "./DashboardSchedule";
import { DashboardTools } from "./DashboardTools";
import { DashboardNotifications } from "./DashboardNotifications";
import { DEMO_METRICS, DASHBOARD_SESSIONS } from "../data/dashboard.data";

export function TutorDashboard() {
  return (
    <div className="space-y-6">
      <DashboardWelcome />
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
        <p>Tổng quan giảng dạy</p>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
          Dữ liệu minh họa
        </span>
      </div>
      <dl className="grid grid-cols-1 gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-2 xl:grid-cols-4">
        {DEMO_METRICS.map((metric) => (
          <div key={metric.label} className="min-w-0">
            <dt className="text-sm font-medium text-muted-foreground">{metric.label}</dt>
            <dd className="mt-1 font-nunito text-3xl font-extrabold tabular-nums leading-[1.2] text-primary">
              {metric.value}
            </dd>
            <dd className="mt-1 text-sm text-muted-foreground">{metric.description}</dd>
          </div>
        ))}
      </dl>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(290px,1fr)]">
        <DashboardSchedule sessions={DASHBOARD_SESSIONS} />
        <aside className="min-w-0 space-y-6" aria-label="Công cụ và thông báo">
          <DashboardTools />
          <DashboardNotifications />
        </aside>
      </div>
    </div>
  );
}
