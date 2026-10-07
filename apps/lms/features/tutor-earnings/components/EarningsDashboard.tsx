"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { EARNINGS_REPORTS } from "../data/earnings.mock";
import { useEarnings } from "../hooks/useEarnings";
import type { EarningSession, EarningsReport } from "../types/earnings.types";
import { exportEarningsToExcel } from "../utils/earnings.utils";
import { EarningDetailDialog } from "./EarningsDialogs";
import { EarningsReportsPanel } from "./EarningsReportsPanel";
import { EarningsTable } from "./EarningsTable";
import { EarningsToolbar } from "./EarningsToolbar";
import { ReportIssueDialog } from "./ReportIssueDialog";
import { outlineActionClass, primaryActionClass } from "./earnings-ui";

export function EarningsDashboard() {
  const earnings = useEarnings();
  const [view, setView] = useState<"sessions" | "reports">("sessions");
  const [selectedSession, setSelectedSession] = useState<EarningSession | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reports, setReports] = useState<EarningsReport[]>(EARNINGS_REPORTS);
  function openDetail(session: EarningSession) { setSelectedSession(session); setDetailOpen(true); }
  function openReport(session: EarningSession) { setSelectedSession(session); setReportOpen(true); }
  function submitReport(title: string, description: string) {
    if (!selectedSession) return;
    const id = crypto.randomUUID();
    setReports((current) => [{ id, reportCode: `BC-${id.slice(0, 8).toUpperCase()}`, sessionId: selectedSession.id, title, description, createdAt: new Date().toISOString(), status: "received" }, ...current]);
    setReportOpen(false);
    setView("reports");
    toast.success("Đã tạo đơn báo cáo (mock)", { description: "Đơn lưu trong phiên hiện tại. Chưa kết nối hệ thống admin." });
  }
  function handleExport() {
    try {
      exportEarningsToExcel(earnings.filteredSessions);
      toast.success("Đã xuất báo cáo Excel", { description: `${earnings.filteredSessions.length} buổi phù hợp bộ lọc, bao gồm tất cả các trang.` });
    } catch {
      toast.error("Không thể xuất báo cáo", { description: "Vui lòng thử lại." });
    }
  }
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="mb-2 text-xs font-bold text-muted-foreground">ĐỐI SOÁT GIA SƯ · DỮ LIỆU MINH HỌA</p><h1 className="font-nunito text-2xl font-extrabold leading-relaxed text-primary sm:text-3xl">Thu nhập & Thanh toán</h1><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Theo dõi từng buổi đã dạy, trạng thái quyết toán và yêu cầu hỗ trợ.</p></div>
          {view === "sessions" && <div className="flex flex-col items-start gap-2 md:items-end"><button type="button" onClick={handleExport} disabled={!earnings.filteredSessions.length} className={primaryActionClass}><DownloadSimple size={18} weight="bold" aria-hidden="true" />Xuất Excel</button><p className="text-xs text-muted-foreground">Xuất toàn bộ kết quả theo bộ lọc</p></div>}
        </header>
        <div role="group" aria-label="Chọn mục đối soát" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={view === "sessions"} onClick={() => setView("sessions")} className={view === "sessions" ? primaryActionClass : outlineActionClass}>Thu nhập theo buổi</button>
          <button type="button" aria-pressed={view === "reports"} onClick={() => setView("reports")} className={view === "reports" ? primaryActionClass : outlineActionClass}>Đơn báo cáo ({reports.length})</button>
        </div>
        {view === "sessions" ? <div className="space-y-5">
          <EarningsToolbar period={earnings.period} referenceDate={earnings.referenceDate} status={earnings.status} search={earnings.search} onPeriodChange={earnings.setPeriod} onReferenceDateChange={earnings.setReferenceDate} onStatusChange={earnings.setStatus} onSearchChange={earnings.setSearch} />
          <EarningsTable sessions={earnings.pagedSessions} totalCount={earnings.filteredSessions.length} totalFee={earnings.totalFee} page={earnings.page} pageCount={earnings.pageCount} onPageChange={earnings.setPage} onResetFilters={earnings.resetFilters} onViewDetail={openDetail} onReport={openReport} />
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">Thu nhập áp dụng mức phí đã chốt trước mỗi buổi hoàn thành. “Đang kiểm tra” là khoản chờ admin xác minh, không đồng nghĩa đã quyết toán.</p>
        </div> : <EarningsReportsPanel reports={reports} />}
      </div>
      <EarningDetailDialog session={selectedSession} open={detailOpen} onOpenChange={setDetailOpen} onReport={openReport} />
      <ReportIssueDialog key={selectedSession?.id ?? "no-session"} session={selectedSession} open={reportOpen} onOpenChange={setReportOpen} onSubmit={submitReport} />
    </div>
  );
}
