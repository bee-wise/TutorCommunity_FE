"use client";

import { useState } from "react";
import { Info, MicrosoftExcelLogo } from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { EARNINGS_REPORTS } from "../data/earnings.mock";
import { useEarnings } from "../hooks/useEarnings";
import type { EarningSession, EarningsReport } from "../types/earnings.types";
import { exportEarningsToExcel } from "../utils/earnings.utils";
import { EarningDetailDialog } from "./EarningsDialogs";
import { EarningsReportsPanel } from "./EarningsReportsPanel";
import { EarningsSummaryCards } from "./EarningsSummaryCards";
import { EarningsTable } from "./EarningsTable";
import { EarningsToolbar } from "./EarningsToolbar";
import { ReportIssueDialog } from "./ReportIssueDialog";

export function EarningsDashboard() {
  const earnings = useEarnings();
  const [selectedSession, setSelectedSession] = useState<EarningSession | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reports, setReports] = useState<EarningsReport[]>(EARNINGS_REPORTS);

  function openDetail(session: EarningSession) {
    setSelectedSession(session);
    setDetailOpen(true);
  }

  function openReport(session: EarningSession) {
    setSelectedSession(session);
    setReportOpen(true);
  }

  function submitReport(title: string, description: string) {
    if (!selectedSession) return;
    const newReport: EarningsReport = {
      id: `report-${Date.now()}`,
      reportCode: `BC-${new Date().getDate().toString().padStart(2, "0")}${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${(reports.length + 1).toString().padStart(3, "0")}`,
      sessionId: selectedSession.id,
      title,
      description,
      createdAt: new Date().toISOString(),
      status: "received",
    };
    setReports((current) => [newReport, ...current]);
    setReportOpen(false);
    toast.success("Đã gửi báo cáo", {
      description:
        "Admin đã tiếp nhận và sẽ phản hồi trong danh sách đơn báo cáo.",
    });
  }

  function handleExport() {
    exportEarningsToExcel(earnings.filteredSessions);
    toast.success("Đã xuất file Excel", {
      description: `${earnings.filteredSessions.length} buổi học đã được đưa vào báo cáo.`,
    });
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              Thu nhập & Thanh toán
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Theo dõi học phí từng buổi đã dạy, trạng thái quyết toán và các
              yêu cầu hỗ trợ.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#DCE8FB] bg-white px-3.5 py-2 text-xs text-muted-foreground shadow-sm">
            <MicrosoftExcelLogo
              size={19}
              weight="duotone"
              className="text-[#447353]"
              aria-hidden="true"
            />
            Báo cáo Excel áp dụng đúng bộ lọc đang chọn
          </div>
        </header>

        <EarningsSummaryCards summary={earnings.summary} />

        <div className="flex items-start gap-2 rounded-xl border border-[#FFC500]/35 bg-[#FFC500]/10 px-3.5 py-3 text-sm text-[#905B0F]">
          <Info
            className="mt-0.5 shrink-0"
            size={18}
            weight="bold"
            aria-hidden="true"
          />
          <p>
            Hệ thống quyết toán các buổi hợp lệ theo chu kỳ. Buổi đang kiểm tra
            sẽ được cập nhật sau khi admin xác minh.
          </p>
        </div>

        <EarningsToolbar
          period={earnings.period}
          referenceDate={earnings.referenceDate}
          status={earnings.status}
          search={earnings.search}
          exportDisabled={earnings.filteredSessions.length === 0}
          onPeriodChange={earnings.setPeriod}
          onReferenceDateChange={earnings.setReferenceDate}
          onStatusChange={earnings.setStatus}
          onSearchChange={earnings.setSearch}
          onExport={handleExport}
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <EarningsTable
            sessions={earnings.filteredSessions}
            onViewDetail={openDetail}
            onReport={openReport}
          />
          <EarningsReportsPanel reports={reports} />
        </div>
      </div>

      <EarningDetailDialog
        session={selectedSession}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onReport={openReport}
      />
      <ReportIssueDialog
        session={selectedSession}
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={submitReport}
      />
    </div>
  );
}
