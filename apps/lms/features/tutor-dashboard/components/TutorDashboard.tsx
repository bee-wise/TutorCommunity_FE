import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardSchedule } from "./DashboardSchedule";
import { DashboardTools } from "./DashboardTools";
import { DashboardNotifications } from "./DashboardNotifications";
import { DASHBOARD_SESSIONS } from "../data/dashboard.data";
import { LmsProfileSummary } from "@/features/lms-workspace/components/LmsProfileSummary";

export function TutorDashboard() {
  return (
    <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-7 p-4 sm:p-6 lg:p-8">
        <DashboardWelcome />
        <DashboardSchedule sessions={DASHBOARD_SESSIONS} />
      </div>
      <aside className="grid min-w-0 content-start gap-7 border-t border-border bg-card p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-1 xl:border-l xl:border-t-0" aria-label="Tài khoản, công cụ và thông báo">
        <LmsProfileSummary />
        <DashboardTools />
        <DashboardNotifications />
      </aside>
    </div>
  );
}
