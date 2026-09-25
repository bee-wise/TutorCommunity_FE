"use client";

import { ArrowRight } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import type { MockDashboard } from "../data/dashboard.mock";
import type { DashboardRange } from "../data/dashboardRange";
import { DashboardMetricCard, DashboardSection, MetricTrendLabel, formatMoney, formatNumber, formatPercent, type MetricTrend } from "./DashboardMetricCard";

const FinancialTrendChart = dynamic(
  () => import("./FinancialTrendChart").then((module) => module.FinancialTrendChart),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-2xl bg-muted" /> },
);

function FinancialFact({ label, value, note, trend }: { label: string; value: string; note?: string; trend?: MetricTrend }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-lg font-bold tabular-nums text-foreground">{value}</p>
      {trend && <p className="mt-1"><MetricTrendLabel trend={trend} /></p>}
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function FinancialSection({ mock, range }: { mock: MockDashboard; range: DashboardRange }) {
  const financial = mock.financial;
  const flow = [
    { label: "GMV", value: financial.gmv, previous: mock.previousFinancial.gmv, note: "Tiền học viên thanh toán" },
    { label: "Doanh thu gross", value: financial.grossRevenue, previous: mock.previousFinancial.grossRevenue, note: "GMV trừ tiền trả gia sư" },
    { label: "Doanh thu thuần", value: financial.netRevenue, previous: mock.previousFinancial.netRevenue, note: "Gross trừ refund & phí thanh toán" },
    { label: "Lợi nhuận ước tính", value: financial.profit, previous: mock.previousFinancial.profit, note: "Thuần trừ chi phí vận hành" },
  ];

  return (
    <DashboardSection number="02" title="Doanh thu & lợi nhuận" description="Mô phỏng theo kỳ đã chọn; các giá trị được tính từ cùng một bộ giao dịch.">
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="grid gap-3 @[34rem]/dashboard:grid-cols-2 @[70rem]/dashboard:grid-cols-4">
          {flow.map((step, index) => (
            <div key={step.label} className="flex min-w-0 items-center gap-3">
              <div className={`min-w-0 flex-1 rounded-2xl p-4 ${index === 0 ? "bg-primary text-primary-foreground" : index === 3 ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
                <p className="text-xs font-semibold opacity-80">{step.label}</p>
                <p className="mt-2 break-words text-xl font-bold tabular-nums">{formatMoney(step.value, true)}</p>
                <p className="mt-1 text-[11px] opacity-75">{step.note}</p>
                <div className="mt-2"><MetricTrendLabel trend={{ current: step.value, previous: step.previous, favorable: "up" }} prominent={index === 0 || index === 3} /></div>
              </div>
              {index < flow.length - 1 && <ArrowRight aria-hidden="true" className="hidden size-4 shrink-0 text-primary @[70rem]/dashboard:block" />}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          GMV là tổng giá trị giao dịch; phần trả gia sư không được tính là doanh thu của nền tảng. Doanh thu và lợi nhuận là hai mức khác nhau.
        </p>
      </div>

      <FinancialTrendChart days={mock.financialSeries} to={range.to} />

      <div className="grid gap-4 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-4">
        <DashboardMetricCard label="Thanh toán cho gia sư" value={formatMoney(financial.tutorPayouts, true)} detail="GMV trừ doanh thu gross" mock />
        <DashboardMetricCard label="Tiền hoàn" value={formatMoney(financial.refunds, true)} detail="Khoản hoàn cho học viên" mock />
        <DashboardMetricCard label="Phí thanh toán" value={formatMoney(financial.paymentFees, true)} detail="Phí xử lý giao dịch" mock />
        <DashboardMetricCard label="Chi phí vận hành" value={formatMoney(financial.operatingCosts, true)} detail="Ước tính cho kỳ này" mock />
      </div>

      <div className="grid gap-3 @[35rem]/dashboard:grid-cols-2 @[68rem]/dashboard:grid-cols-4">
        <FinancialFact label="Take rate / hoa hồng" value={formatPercent(financial.takeRate)} note="Gross revenue / GMV" />
        <FinancialFact label="Biên lợi nhuận" value={formatPercent(financial.profitMargin)} note="Lợi nhuận / doanh thu thuần" />
        <FinancialFact label="ARPPU" value={formatMoney(financial.arppu, true)} note="Doanh thu gross / người trả tiền" />
        <FinancialFact label="Giá trị giao dịch TB" value={formatMoney(financial.averageTransactionValue, true)} note="GMV / thanh toán thành công" />
        <FinancialFact label="Người thanh toán" value={formatNumber(financial.payingUsers)} />
        <FinancialFact label="Thanh toán thành công" value={formatNumber(financial.successfulPayments)} />
        <FinancialFact label="Thanh toán thất bại" value={formatNumber(financial.failedPayments)} note="Giảm là tín hiệu tốt" trend={{ current: financial.failedPayments, previous: mock.previousFinancial.failedPayments, favorable: "down" }} />
        <FinancialFact label="Tỷ lệ hoàn tiền" value={formatPercent(financial.refundRate)} note="Tiền hoàn / GMV · giảm là tốt" trend={financial.refundRate !== null && mock.previousFinancial.refundRate !== null ? { current: financial.refundRate, previous: mock.previousFinancial.refundRate, favorable: "down" } : undefined} />
      </div>
      <p className="text-xs font-medium text-warning">Toàn bộ chỉ số tài chính trong phần này là dữ liệu mẫu frontend.</p>
    </DashboardSection>
  );
}
