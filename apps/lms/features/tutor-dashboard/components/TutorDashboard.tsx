import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardStats } from "./DashboardStats";
import { DashboardWeekChart } from "./DashboardWeekChart";
import { LiveDashboardSchedule } from "./LiveDashboardSchedule";
import { DashboardTools } from "./DashboardTools";
import { DashboardReadiness } from "./DashboardReadiness";
import { DashboardNotifications } from "./DashboardNotifications";
import { LmsProfileSummary } from "@/features/lms-workspace/components/LmsProfileSummary";

export function TutorDashboard() {
  return (
    <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4 p-4 sm:p-5 lg:p-6">
        <DashboardWelcome />
        <DashboardStats />
        <LiveDashboardSchedule />
        <DashboardWeekChart />
      </div>
      <aside className="grid min-w-0 content-start gap-6 border-t border-border bg-card p-5 sm:grid-cols-2 xl:grid-cols-1 xl:border-l xl:border-t-0" aria-label="Tài khoản, công cụ và thông báo">
        <LmsProfileSummary />
        <DashboardReadiness />
        <DashboardTools />
        <DashboardNotifications />
      </aside>
    </div>
  );
}
