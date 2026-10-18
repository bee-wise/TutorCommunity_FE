import { CalendarDaysIcon as CalendarX } from "@heroicons/react/24/outline";
import type { TuitionSession } from "../types/tuition-fee.types";
import {
  formatTuitionCurrency,
  formatTuitionDate,
} from "../utils/tuition-fee.utils";
import { TuitionChargeStatusBadge } from "./TuitionStatusBadge";

export function TuitionSessionLedger({ sessions }: { sessions: TuitionSession[] }) {
  if (sessions.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center"><CalendarX className="mx-auto text-muted-foreground" width={34} height={34} /><h2 className="mt-3 font-extrabold text-foreground">Không có buổi học phù hợp</h2><p className="mt-1 text-sm text-muted-foreground">Hãy thử thay đổi bộ lọc hoặc từ khóa.</p></div>;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft" aria-labelledby="tuition-sessions-title">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5"><div><h2 id="tuition-sessions-title" className="text-lg font-extrabold text-foreground">Phân bổ theo buổi học</h2><p className="mt-1 text-xs text-muted-foreground">Buổi đã hủy không bị trừ học phí.</p></div><span className="text-sm font-bold text-primary">{sessions.length} buổi</span></header>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-muted text-xs text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Buổi học</th><th className="px-4 py-3 font-semibold">Thời gian</th><th className="px-4 py-3 font-semibold">Học phí</th><th className="px-5 py-3 font-semibold">Ghi nhận</th></tr></thead>
          <tbody>{sessions.map((session) => <tr key={session.id} className="border-t border-border/70"><td className="px-5 py-4"><p className="font-bold text-foreground">Buổi {session.sequence}: {session.topic}</p><p className="mt-1 text-xs text-muted-foreground">{session.durationMinutes} phút</p></td><td className="px-4 py-4 text-sm font-medium text-foreground">{formatTuitionDate(session.scheduledAt)}</td><td className="px-4 py-4 text-sm font-extrabold text-foreground">{formatTuitionCurrency(session.amount)}</td><td className="px-5 py-4"><TuitionChargeStatusBadge status={session.chargeStatus} /></td></tr>)}</tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 md:hidden">
        {sessions.map((session) => <article key={session.id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-foreground">Buổi {session.sequence}</h3><p className="mt-1 text-sm font-semibold text-foreground">{session.topic}</p></div><TuitionChargeStatusBadge status={session.chargeStatus} /></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-muted-foreground">Thời gian</dt><dd className="mt-1 font-semibold text-foreground">{formatTuitionDate(session.scheduledAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Học phí</dt><dd className="mt-1 font-extrabold text-foreground">{formatTuitionCurrency(session.amount)}</dd></div><div><dt className="text-xs text-muted-foreground">Thời lượng</dt><dd className="mt-1 font-semibold text-foreground">{session.durationMinutes} phút</dd></div></dl></article>)}
      </div>
    </section>
  );
}
