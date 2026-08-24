import { CaretDown, CheckCircle, Clock, Headset } from "@phosphor-icons/react";
import type { EarningsReport } from "../types/earnings.types";
import { formatDateTime } from "../utils/earnings.utils";

const REPORT_STATUS = {
  received: { label: "Đã tiếp nhận", className: "text-[#280F91] bg-[#280F91]/8", icon: Clock },
  processing: { label: "Đang xử lý", className: "text-[#905B0F] bg-[#FFC500]/15", icon: Clock },
  resolved: { label: "Đã giải quyết", className: "text-[#447353] bg-[#447353]/10", icon: CheckCircle },
} as const;

export function EarningsReportsPanel({ reports }: { reports: EarningsReport[] }) {
  return (
    <aside className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5" aria-labelledby="reports-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="reports-title" className="flex items-center gap-2 text-lg font-extrabold">
            <Headset size={21} weight="duotone" className="text-[#280F91]" aria-hidden="true" />
            Đơn báo cáo
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Theo dõi phản hồi từ admin.</p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-[#280F91]">
          {reports.length} đơn
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {reports.map((report) => {
          const status = REPORT_STATUS[report.status];
          const Icon = status.icon;
          return (
            <article key={report.id} className="rounded-xl border border-border p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{report.reportCode}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${status.className}`}>
                  <Icon size={13} weight="bold" aria-hidden="true" />
                  {status.label}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-extrabold text-foreground">{report.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(report.createdAt)}</p>
              <details className="group mt-3 border-t border-border pt-2.5 text-xs">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-[#280F91]">
                  Xem đơn
                  <CaretDown
                    size={14}
                    weight="bold"
                    className="transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-2 leading-5 text-muted-foreground">{report.description}</p>
                {report.adminResponse && (
                  <div className="mt-2 rounded-lg bg-[#447353]/8 p-2.5 leading-5 text-[#447353]">
                    <strong>Phản hồi admin:</strong> {report.adminResponse}
                  </div>
                )}
              </details>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
