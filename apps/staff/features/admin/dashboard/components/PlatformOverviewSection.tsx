import { Coins, GraduationCap, UsersThree } from "@phosphor-icons/react";
import type { MockDashboard } from "../data/dashboard.mock";
import type { DashboardData } from "../schemas/dashboard.schema";
import {
  DashboardMetricCard,
  DashboardSection,
  formatMoney,
  formatNumber,
} from "./DashboardMetricCard";

export function PlatformOverviewSection({
  summary,
  mock,
}: {
  summary: DashboardData["summary"];
  mock: MockDashboard;
}) {
  return (
    <DashboardSection
      number="01"
      title="Tổng quan nền tảng"
      description="Quy mô hiện tại và sức hoạt động trong kỳ đã chọn."
    >
      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-3">
        <DashboardMetricCard
          label="Tổng người dùng"
          value={formatNumber(summary.totalUsers?.value)}
          detail="Ảnh chụp hiện tại"
          mock={summary.totalUsers?.isMock}
          icon={<UsersThree className="size-5" />}
        />
        <DashboardMetricCard
          label="Người dùng hoạt động"
          value={formatNumber(mock.activity.activeUsers)}
          detail="Hoạt động trong kỳ"
          mock
          trend={{
            current: mock.activity.activeUsers,
            previous: mock.previousActivity.activeUsers,
            favorable: "up",
          }}
          icon={<UsersThree className="size-5" />}
        />
        <DashboardMetricCard
          label="Tổng gia sư"
          value={formatNumber(summary.totalTutors?.value)}
          detail="Ảnh chụp hiện tại"
          mock={summary.totalTutors?.isMock}
          icon={<GraduationCap className="size-5" />}
        />
        <DashboardMetricCard
          label="Gia sư hoạt động"
          value={formatNumber(mock.activity.activeTutors)}
          detail="Có hoạt động trong kỳ"
          mock
          trend={{
            current: mock.activity.activeTutors,
            previous: mock.previousActivity.activeTutors,
            favorable: "up",
          }}
          icon={<GraduationCap className="size-5" />}
        />
        <DashboardMetricCard
          label="GMV · Tổng giao dịch"
          value={formatMoney(mock.financial.gmv, true)}
          detail="Tiền học viên thanh toán"
          mock
          tone="primary"
          trend={{
            current: mock.financial.gmv,
            previous: mock.previousFinancial.gmv,
            favorable: "up",
          }}
          icon={<Coins className="size-5" />}
        />
        <DashboardMetricCard
          label="Doanh thu thuần"
          value={formatMoney(mock.financial.netRevenue, true)}
          detail="Sau refund và phí thanh toán"
          mock
          tone="accent"
          trend={{
            current: mock.financial.netRevenue,
            previous: mock.previousFinancial.netRevenue,
            favorable: "up",
          }}
          icon={<Coins className="size-5" />}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <span className="font-medium text-muted-foreground">
          Người dùng mới trong kỳ
        </span>
        <strong className="text-lg tabular-nums text-foreground">
          {formatNumber(mock.activity.newUsers)}
        </strong>
        <span className="rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-bold text-warning">
          Mẫu
        </span>
      </div>
    </DashboardSection>
  );
}
