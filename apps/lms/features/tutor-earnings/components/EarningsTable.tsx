import type { EarningSession } from "../types/earnings.types";
import { formatCurrency, formatDateTime } from "../utils/earnings.utils";
import { EarningsStatusBadge } from "./EarningsStatusBadge";
import { outlineActionClass, panelClass } from "./earnings-ui";

interface EarningsTableProps {
  sessions: EarningSession[];
  totalCount: number;
  totalFee: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onViewDetail: (session: EarningSession) => void;
  onReport: (session: EarningSession) => void;
}

function ActionButtons({ session, onViewDetail, onReport }: Pick<EarningsTableProps, "onViewDetail" | "onReport"> & { session: EarningSession }) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button type="button" onClick={() => onReport(session)} aria-label={`Báo cáo vấn đề của ${session.sessionCode}`} className={outlineActionClass}>Báo cáo</button>
      <button type="button" onClick={() => onViewDetail(session)} aria-label={`Chi tiết thu nhập ${session.sessionCode}`} className={`${outlineActionClass} border-primary`}>Chi tiết</button>
    </div>
  );
}

export function EarningsTable(props: EarningsTableProps) {
  if (!props.totalCount) return (
    <section className={`${panelClass} grid min-h-64 place-items-center p-6 text-center`}>
      <div>
        <h2 className="font-nunito text-xl font-extrabold text-primary">Không có buổi học phù hợp</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">Thử đổi mốc thời gian, trạng thái hoặc từ khóa tìm kiếm.</p>
        <button type="button" className={`${outlineActionClass} mt-5`} onClick={props.onResetFilters}>Đặt lại bộ lọc</button>
      </div>
    </section>
  );
  return (
    <section className={`${panelClass} overflow-hidden`} aria-labelledby="earnings-list-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div>
          <h2 id="earnings-list-title" className="font-nunito text-lg font-extrabold text-primary">Thu nhập theo buổi</h2>
          <p className="mt-1 text-xs text-muted-foreground">Chỉ ghi nhận buổi học đã hoàn thành.</p>
        </div>
        <span className="text-sm font-bold text-muted-foreground">{props.totalCount} buổi phù hợp</span>
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[800px] text-left text-sm">
          <caption className="sr-only">Thu nhập theo buổi học, thời gian dạy và trạng thái quyết toán</caption>
          <thead className="text-xs text-muted-foreground">
            <tr>{["Buổi học / Học viên", "Thời gian dạy", "Thu nhập", "Quyết toán", "Thao tác"].map((label, index) => <th key={label} scope="col" className={`px-5 py-3 font-bold ${index === 4 ? "text-right" : ""}`}>{label}</th>)}</tr>
          </thead>
          <tbody>
            {props.sessions.map((session) => (
              <tr key={session.id} className="border-t border-border">
                <td className="max-w-64 px-5 py-4"><p className="font-bold text-foreground">{session.className}</p><p className="mt-1 text-muted-foreground">{session.learnerName}</p><p className="mt-1 text-xs text-muted-foreground">{session.sessionCode}</p></td>
                <td className="px-5 py-4"><p>{formatDateTime(session.taughtAt)}</p><p className="mt-1 text-xs text-muted-foreground">{session.durationMinutes} phút</p></td>
                <td className="whitespace-nowrap px-5 py-4 font-nunito text-lg font-extrabold tabular-nums text-primary">{formatCurrency(session.fee)}</td>
                <td className="px-5 py-4"><EarningsStatusBadge status={session.settlementStatus} /></td>
                <td className="px-5 py-4"><ActionButtons {...props} session={session} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid divide-y divide-border lg:hidden">
        {props.sessions.map((session) => (
          <article key={session.id} className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1 basis-44"><h3 className="font-bold leading-relaxed">{session.className}</h3><p className="mt-1 text-xs text-muted-foreground">{session.sessionCode} · {session.learnerName}</p></div>
              <EarningsStatusBadge status={session.settlementStatus} />
            </div>
            <dl className="flex flex-wrap justify-between gap-4 text-sm">
              <div><dt className="text-xs text-muted-foreground">Thời gian dạy</dt><dd className="mt-1">{formatDateTime(session.taughtAt)} · {session.durationMinutes} phút</dd></div>
              <div><dt className="text-xs text-muted-foreground">Thu nhập</dt><dd className="mt-1 font-nunito text-lg font-extrabold tabular-nums text-primary">{formatCurrency(session.fee)}</dd></div>
            </dl>
            <ActionButtons {...props} session={session} />
          </article>
        ))}
      </div>
      <footer className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm text-muted-foreground">Tổng theo bộ lọc <strong className="ml-2 font-nunito text-lg font-extrabold tabular-nums text-primary">{formatCurrency(props.totalFee)}</strong></p>
        <nav aria-label="Phân trang thu nhập" className="flex items-center justify-between gap-3">
          <button type="button" className={outlineActionClass} disabled={props.page === 0} onClick={() => props.onPageChange(props.page - 1)}>Trước</button>
          <span aria-live="polite" className="text-xs text-muted-foreground">{props.page + 1} / {props.pageCount}</span>
          <button type="button" className={outlineActionClass} disabled={props.page + 1 === props.pageCount} onClick={() => props.onPageChange(props.page + 1)}>Sau</button>
        </nav>
      </footer>
    </section>
  );
}
