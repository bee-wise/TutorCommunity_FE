import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardSchedule } from "./DashboardSchedule";
import { DashboardTools } from "./DashboardTools";
import { DashboardNotifications } from "./DashboardNotifications";
import { DASHBOARD_SESSIONS } from "../data/dashboard.data";

export function TutorDashboard() {
  return (
    <div className="space-y-5">
      <DashboardWelcome />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
        <DashboardSchedule sessions={DASHBOARD_SESSIONS} />
        <aside className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-1" aria-label="Công cụ và thông báo">
          <DashboardTools />
          <DashboardNotifications />
        </aside>
      </div>
    </div>
  );
}
