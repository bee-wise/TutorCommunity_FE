"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { createMockDashboard } from "../data/dashboard.mock";
import {
  formatDateInput,
  resolveDashboardRange,
  type DashboardRangePreset,
} from "../data/dashboardRange";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { DashboardRangeFilter } from "./DashboardRangeFilter";
import { FinancialSection } from "./FinancialSection";
import {
  ConversionSection,
  ResponsePerformanceSection,
  SearchDiscoverySection,
  TutorMarketplaceSection,
  TutorOperationsSection,
} from "./MarketplaceSections";
import { PlatformOverviewSection } from "./PlatformOverviewSection";

function DashboardSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Đang tải dashboard">
      <div className="h-36 animate-pulse rounded-3xl bg-muted" />
      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-3xl bg-muted" />
    </div>
  );
}

export function AdminDashboardScreen() {
  const [referenceDate] = useState(() => new Date());
  const [preset, setPreset] = useState<DashboardRangePreset>("30d");
  const [customFrom, setCustomFrom] = useState(() => {
    const start = new Date(referenceDate);
    start.setDate(start.getDate() - 29);
    return formatDateInput(start);
  });
  const [customTo, setCustomTo] = useState(() =>
    formatDateInput(referenceDate),
  );
  const range = useMemo(
    () => resolveDashboardRange(preset, referenceDate, customFrom, customTo),
    [preset, referenceDate, customFrom, customTo],
  );
  const dashboard = useAdminDashboard(range);
  const summary = dashboard.data?.summary;
  const mock = useMemo(
    () => (range && summary ? createMockDashboard(range, summary) : null),
    [range, summary],
  );
  const lastUpdated = dashboard.data?.generatedAt
    ? new Date(dashboard.data.generatedAt).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <main className="@container/dashboard min-w-0 bg-muted/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Tổng quan vận hành
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Theo dõi sức khỏe thị trường gia sư, hành trình kết nối và hiệu
                quả tài chính.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-right text-xs text-muted-foreground">
                  Cập nhật lúc
                  <br />
                  {lastUpdated}
                </span>
              )}
              <button
                type="button"
                onClick={() => void dashboard.refetch()}
                disabled={dashboard.isFetching || !range}
                aria-label="Làm mới dashboard"
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <ArrowClockwise className="size-5" />
              </button>
            </div>
          </div>
          <DashboardRangeFilter
            preset={preset}
            onPresetChange={setPreset}
            customFrom={customFrom}
            customTo={customTo}
            onCustomFromChange={setCustomFrom}
            onCustomToChange={setCustomTo}
            referenceDate={referenceDate}
            invalid={range === null}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
              API hiện có + mock frontend
            </span>
            {range && <span>Kỳ phân tích: {range.label}. Chỉ số dòng chảy theo kỳ; tổng user và gia sư là ảnh chụp hiện tại.</span>}
          </div>
        </header>

        {!range ? (
          <p
            className="rounded-2xl border border-error bg-card p-6 text-sm text-destructive"
            role="alert"
          >
            Khoảng thời gian không hợp lệ. Hãy chọn ngày bắt đầu không sau ngày
            kết thúc.
          </p>
        ) : dashboard.isPending ? (
          <DashboardSkeleton />
        ) : dashboard.isError && !summary ? (
          <div
            className="rounded-3xl border border-error bg-card p-8 text-center"
            role="alert"
          >
            <WarningCircle className="mx-auto size-10 text-destructive" />
            <h2 className="mt-3 text-lg font-bold text-foreground">
              Không thể tải dashboard
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {getApiErrorMessage(dashboard.error)}
            </p>
            <button
              type="button"
              onClick={() => void dashboard.refetch()}
              className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Thử lại
            </button>
          </div>
        ) : summary && mock ? (
          <>
            {dashboard.isError && (
              <p
                className="rounded-xl border border-error bg-card px-4 py-3 text-sm text-warning"
                role="status"
              >
                Không thể cập nhật dữ liệu mới. Đang hiển thị lần tải thành công
                gần nhất.
              </p>
            )}
            <PlatformOverviewSection summary={summary} mock={mock} />
            <FinancialSection mock={mock} range={range} />
            <SearchDiscoverySection summary={summary} mock={mock} />
            <ConversionSection summary={summary} mock={mock} />
            <TutorMarketplaceSection summary={summary} mock={mock} />
            <ResponsePerformanceSection summary={summary} mock={mock} />
            <TutorOperationsSection summary={summary} />
          </>
        ) : null}
      </div>
    </main>
  );
}
