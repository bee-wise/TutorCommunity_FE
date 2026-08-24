import {
  ArrowRight,
  CalendarX,
  WarningCircle,
} from "@phosphor-icons/react";
import type { EarningSession } from "../types/earnings.types";
import { formatCurrency, formatDateTime } from "../utils/earnings.utils";
import { EarningsStatusBadge } from "./EarningsStatusBadge";

interface EarningsTableProps {
  sessions: EarningSession[];
  onViewDetail: (session: EarningSession) => void;
  onReport: (session: EarningSession) => void;
}

function ActionButtons({
  session,
  onViewDetail,
  onReport,
}: EarningsTableProps & { session: EarningSession }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onReport(session)}
        className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-[#FFC500]/15 hover:text-[#905B0F]"
        aria-label={`Báo cáo vấn đề của ${session.sessionCode}`}
        title="Báo cáo vấn đề"
      >
        <WarningCircle size={19} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onViewDetail(session)}
        className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-[#280F91] transition-colors hover:bg-[#280F91]/8"
      >
        Chi tiết
        <ArrowRight size={15} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}

export function EarningsTable(props: EarningsTableProps) {
  if (props.sessions.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#280F91]/20 bg-white p-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-[#280F91]">
            <CalendarX size={25} weight="duotone" aria-hidden="true" />
          </span>
          <h3 className="mt-3 text-lg font-extrabold">Chưa có dữ liệu phù hợp</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Hãy đổi mốc thời gian, trạng thái hoặc từ khóa để xem các buổi học khác.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="earnings-list-title">
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
        <div>
          <h2 id="earnings-list-title" className="text-lg font-extrabold text-foreground">
            Chi tiết theo buổi học
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Học phí được ghi nhận sau khi buổi học hoàn thành.
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#280F91]">
          {props.sessions.length} buổi
        </span>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[920px] text-left">
          <thead className="bg-muted/55 text-xs text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Buổi học</th>
              <th className="px-4 py-3 font-semibold">Học viên</th>
              <th className="px-4 py-3 font-semibold">Thời gian</th>
              <th className="px-4 py-3 font-semibold">Học phí</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {props.sessions.map((session) => (
              <tr key={session.id} className="border-t border-border/70 transition-colors hover:bg-muted/25">
                <td className="px-5 py-4">
                  <p className="font-bold text-foreground">{session.className}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{session.sessionCode}</p>
                </td>
                <td className="px-4 py-4 text-sm font-medium">{session.learnerName}</td>
                <td className="px-4 py-4 text-sm">
                  <p>{formatDateTime(session.taughtAt)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{session.durationMinutes} phút</p>
                </td>
                <td className="px-4 py-4 font-nunito font-extrabold text-foreground">
                  {formatCurrency(session.fee)}
                </td>
                <td className="px-4 py-4">
                  <EarningsStatusBadge status={session.settlementStatus} />
                </td>
                <td className="px-5 py-4">
                  <ActionButtons {...props} session={session} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {props.sessions.map((session) => (
          <article key={session.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold text-foreground">{session.className}</p>
                <p className="mt-1 text-xs text-muted-foreground">{session.sessionCode}</p>
              </div>
              <EarningsStatusBadge status={session.settlementStatus} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Học viên</dt>
                <dd className="mt-1 font-semibold">{session.learnerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Học phí</dt>
                <dd className="mt-1 font-extrabold">{formatCurrency(session.fee)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Thời gian</dt>
                <dd className="mt-1 font-medium">{formatDateTime(session.taughtAt)} ({session.durationMinutes} phút)</dd>
              </div>
            </dl>
            <div className="mt-3 border-t border-border pt-2">
              <ActionButtons {...props} session={session} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
