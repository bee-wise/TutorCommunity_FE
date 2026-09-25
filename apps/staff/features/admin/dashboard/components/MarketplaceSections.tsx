"use client";

import dynamic from "next/dynamic";
import type { MockDashboard } from "../data/dashboard.mock";
import type { DashboardData } from "../schemas/dashboard.schema";
import {
  DashboardMetricCard,
  DashboardSection,
  formatDuration,
  formatNumber,
  formatPercent,
} from "./DashboardMetricCard";

const ConversionActivityChart = dynamic(
  () =>
    import("./DashboardCharts").then(
      (module) => module.ConversionActivityChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded-3xl bg-muted" />,
  },
);
const TutorStatusChart = dynamic(
  () => import("./DashboardCharts").then((module) => module.TutorStatusChart),
  {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded-3xl bg-muted" />,
  },
);

export function SearchDiscoverySection({
  summary,
  mock,
}: {
  summary: DashboardData["summary"];
  mock: MockDashboard;
}) {
  const activity = mock.activity;
  return (
    <DashboardSection
      number="03"
      title="Tìm kiếm & khám phá"
      description="Nhu cầu tìm gia sư và chất lượng kết quả trong kỳ."
    >
      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-5">
        <DashboardMetricCard
          label="Lượt tìm kiếm"
          value={formatNumber(summary.totalSearches?.value)}
          detail="Sự kiện tìm kiếm"
          mock={summary.totalSearches?.isMock}
        />
        <DashboardMetricCard
          label="Tìm kiếm AI"
          value={formatNumber(summary.totalAiSearches?.value)}
          detail="Sử dụng tìm kiếm thông minh"
          mock={summary.totalAiSearches?.isMock}
        />
        <DashboardMetricCard
          label="Người tìm kiếm duy nhất"
          value={formatNumber(activity.uniqueSearchingUsers)}
          detail="Ước tính trong kỳ"
          mock
        />
        <DashboardMetricCard
          label="Tìm kiếm không kết quả"
          value={formatNumber(activity.zeroResultSearches)}
          detail="Cần cải thiện nguồn cung"
          mock
        />
        <DashboardMetricCard
          label="Tỷ lệ không kết quả"
          value={formatPercent(activity.zeroResultRate)}
          detail="Càng thấp càng tốt"
          mock
        />
      </div>
    </DashboardSection>
  );
}

export function ConversionSection({
  summary,
  mock,
}: {
  summary: DashboardData["summary"];
  mock: MockDashboard;
}) {
  const activity = mock.activity;
  const searchConnectMock = Boolean(
    summary.totalSearches?.isMock || summary.totalConnectRequests?.isMock,
  );
  const connectChatMock = Boolean(
    summary.totalConnectRequests?.isMock || summary.totalChatRooms?.isMock,
  );
  return (
    <DashboardSection
      number="04"
      title="Phễu chuyển đổi"
      description="Từ nhu cầu tìm gia sư đến kết nối và trò chuyện."
    >
      <div className="grid min-w-0 gap-4 @[60rem]/dashboard:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <ConversionActivityChart summary={summary} />
        <div className="grid gap-3 @[35rem]/dashboard:grid-cols-2 @[60rem]/dashboard:grid-cols-1">
          <DashboardMetricCard
            label="Tìm kiếm → Kết nối"
            value={formatPercent(activity.searchConnectRate)}
            detail="Yêu cầu kết nối / lượt tìm kiếm"
            mock={searchConnectMock}
            derived
          />
          <DashboardMetricCard
            label="Kết nối → Chat"
            value={formatPercent(activity.connectChatRate)}
            detail="Phòng chat / yêu cầu kết nối"
            mock={connectChatMock}
            derived
          />
          <DashboardMetricCard
            label="Tìm kiếm AI → Kết nối"
            value={formatPercent(activity.aiSearchConnectRate)}
            detail={
              activity.aiConnectRequests === null
                ? "Chưa đủ dữ liệu để ước tính"
                : `${formatNumber(activity.aiConnectRequests)} kết nối AI ước tính`
            }
            mock
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Các tỷ lệ được tính từ tổng lượt sự kiện, dùng để tham chiếu hiệu quả
        từng bước; chưa phải chuyển đổi theo nhóm người dùng duy nhất.
      </p>
    </DashboardSection>
  );
}

export function TutorMarketplaceSection({
  summary,
  mock,
}: {
  summary: DashboardData["summary"];
  mock: MockDashboard;
}) {
  const activity = mock.activity;
  return (
    <DashboardSection
      number="05"
      title="Nguồn gia sư"
      description="Theo dõi gia sư có thể nhận học viên và khoảng trống phân phối kết nối."
    >
      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-4">
        <DashboardMetricCard
          label="Gia sư hoạt động"
          value={formatNumber(activity.activeTutors)}
          detail="Có hoạt động trong kỳ"
          mock
        />
        <DashboardMetricCard
          label="Gia sư trực tuyến"
          value={formatNumber(summary.onlineTutors?.value)}
          detail="Ảnh chụp hiện tại"
          mock={summary.onlineTutors?.isMock}
        />
        <DashboardMetricCard
          label="Có lịch trống"
          value={formatNumber(activity.tutorsWithAvailability)}
          detail="Ước tính trong nhóm hoạt động"
          mock
        />
        <DashboardMetricCard
          label="Chưa có kết nối"
          value={formatNumber(activity.tutorsWithZeroConnectRequests)}
          detail="Trong nhóm gia sư hoạt động"
          mock
        />
      </div>
      <TutorStatusChart summary={summary} />
    </DashboardSection>
  );
}

export function ResponsePerformanceSection({
  summary,
  mock,
}: {
  summary: DashboardData["summary"];
  mock: MockDashboard;
}) {
  const activity = mock.activity;
  return (
    <DashboardSection
      number="06"
      title="Chất lượng phản hồi"
      description="Tốc độ trả lời và các kết nối cần được theo dõi."
    >
      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-4">
        <DashboardMetricCard
          label="Trung vị phản hồi"
          value={formatDuration(activity.medianResponseTimeSeconds)}
          detail="Ít bị ảnh hưởng bởi phản hồi quá chậm"
          mock
        />
        <DashboardMetricCard
          label="Trung bình phản hồi"
          value={formatDuration(summary.averageResponseTimeSeconds?.value)}
          detail="Càng thấp càng tốt"
          mock={summary.averageResponseTimeSeconds?.isMock}
        />
        <DashboardMetricCard
          label="Tỷ lệ phản hồi"
          value={formatPercent(activity.responseRate)}
          detail="Kết nối đã phản hồi / tổng kết nối"
          mock
        />
        <DashboardMetricCard
          label="Kết nối chưa phản hồi"
          value={formatNumber(activity.unansweredConnectRequests)}
          detail="Cần can thiệp vận hành"
          mock
        />
      </div>
    </DashboardSection>
  );
}

export function TutorOperationsSection({
  summary,
}: {
  summary: DashboardData["summary"];
}) {
  return (
    <DashboardSection
      number="07"
      title="Xác minh & vận hành"
      description="Chất lượng hồ sơ gia sư và nhật ký hoạt động hệ thống."
    >
      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-4">
        <DashboardMetricCard
          label="Gia sư đã duyệt"
          value={formatNumber(summary.approvedTutors?.value)}
          detail="Đủ điều kiện hiển thị"
          mock={summary.approvedTutors?.isMock}
        />
        <DashboardMetricCard
          label="Hồ sơ chờ duyệt"
          value={formatNumber(summary.pendingReviewProfiles?.value)}
          detail="Hàng đợi cần xử lý"
          mock={summary.pendingReviewProfiles?.isMock}
        />
        <DashboardMetricCard
          label="Hồ sơ bị từ chối"
          value={formatNumber(summary.rejectedProfiles?.value)}
          detail="Cần theo dõi chất lượng"
          mock={summary.rejectedProfiles?.isMock}
        />
        <DashboardMetricCard
          label="Sự kiện audit gần đây"
          value={formatNumber(summary.recentAuditCount?.value)}
          detail="Hoạt động quản trị"
          mock={summary.recentAuditCount?.isMock}
        />
      </div>
    </DashboardSection>
  );
}
