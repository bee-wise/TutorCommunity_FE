"use client";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@workspace/ui/components/ui/collapsible";

import { useState } from "react";
import { ChevronDownIcon as CaretDown, DocumentTextIcon as FileText } from "@heroicons/react/24/outline";
import { EARNING_SESSIONS } from "../data/earnings.mock";
import { REPORT_LABELS, type EarningsReport, type ReportStatus } from "../types/earnings.types";
import { formatDateTime } from "../utils/earnings.utils";
import { EarningsReportStatusBadge } from "./EarningsStatusBadge";
import { EarningsSelect } from "./EarningsSelect";
import { panelClass } from "./earnings-ui";

const OPTIONS = [{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(REPORT_LABELS).map(([value, label]) => ({ value, label }))];

export function EarningsReportsPanel({ reports }: { reports: EarningsReport[] }) {
  const [status, setStatus] = useState<"all" | ReportStatus>("all");
  const visibleReports = reports.filter((report) => status === "all" || report.status === status);
  return (
    <section aria-labelledby="reports-title" className="space-y-4">
      <div className={`${panelClass} flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
        <div><h2 id="reports-title" className="font-lms text-lg font-extrabold text-foreground">Đơn báo cáo</h2><p className="mt-1 text-sm text-muted-foreground">{visibleReports.length} đơn · Theo dõi nội dung và phản hồi từ admin.</p></div>
        <div className="grid gap-2 sm:w-56"><label htmlFor="earnings-report-status" className="text-xs font-bold text-muted-foreground">Trạng thái báo cáo</label><EarningsSelect id="earnings-report-status" options={OPTIONS} value={status} onValueChange={(value) => {
          if (value === "all" || value === "received" || value === "processing" || value === "resolved") setStatus(value);
        }} /></div>
      </div>
      {!visibleReports.length && <div className={`${panelClass} p-8 text-center text-sm text-muted-foreground`}>Chưa có đơn báo cáo ở trạng thái này.</div>}
      <div className="grid items-start gap-4 md:grid-cols-2">
        {visibleReports.map((report) => {
          const session = EARNING_SESSIONS.find((item) => item.id === report.sessionId);
          return (
            <article key={report.id} className={`${panelClass} p-4 sm:p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-bold text-muted-foreground">{report.reportCode}</span><EarningsReportStatusBadge status={report.status} /></div>
              <h3 className="mt-4 font-lms text-lg font-extrabold leading-relaxed text-foreground">{report.title}</h3>
              {session && <p className="mt-1 text-sm text-foreground">{session.sessionCode} · {session.learnerName}</p>}
              <p className="mt-2 text-xs text-muted-foreground">Tạo lúc {formatDateTime(report.createdAt)}</p>
              <Collapsible className="group mt-4 overflow-hidden rounded-2xl border border-border/80 bg-muted/20 transition-all hover:border-primary/30">
<CollapsibleTrigger className="w-full flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-xs font-bold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring ">
                  <span className="flex items-center gap-2">
                    <FileText width={15} height={15} />
                    Xem nội dung đơn
                  </span>
                  <CaretDown width={15} height={15} className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
<CollapsibleContent>
                <div className="border-t border-border/60 bg-card/60 p-4 pt-3">
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{report.description}</p>
                  {report.adminResponse ? (
                    <div className="mt-3 rounded-xl border border-secondary/30 bg-secondary/5 p-3 text-sm leading-relaxed">
                      <p className="font-bold text-foreground">Phản hồi admin</p>
                      <p className="mt-1 whitespace-pre-wrap break-words">{report.adminResponse}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">Chưa có phản hồi từ admin.</p>
                  )}
                </div>
              </CollapsibleContent>
</Collapsible>
            </article>
          );
        })}
      </div>
    </section>
  );
}
