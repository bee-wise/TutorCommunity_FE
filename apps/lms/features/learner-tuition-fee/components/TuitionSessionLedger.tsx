import { CalendarX } from "@phosphor-icons/react";
import type { TuitionSession } from "../types/tuition-fee.types";
import {
  formatTuitionCurrency,
  formatTuitionDate,
} from "../utils/tuition-fee.utils";
import { TuitionChargeStatusBadge } from "./TuitionStatusBadge";

export function TuitionSessionLedger({ sessions }: { sessions: TuitionSession[] }) {
  if (sessions.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-14 text-center"><CalendarX className="mx-auto text-slate-400" size={34} weight="duotone" /><h2 className="mt-3 font-extrabold text-slate-950">Không có buổi học phù hợp</h2><p className="mt-1 text-sm text-slate-500">Hãy thử thay đổi bộ lọc hoặc từ khóa.</p></div>;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="tuition-sessions-title">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5"><div><h2 id="tuition-sessions-title" className="text-lg font-extrabold text-slate-950">Phân bổ theo buổi học</h2><p className="mt-1 text-xs text-slate-500">Buổi đã hủy không bị trừ học phí.</p></div><span className="text-sm font-bold text-[#280F91]">{sessions.length} buổi</span></header>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3 font-semibold">Buổi học</th><th className="px-4 py-3 font-semibold">Thời gian</th><th className="px-4 py-3 font-semibold">Học phí</th><th className="px-5 py-3 font-semibold">Ghi nhận</th></tr></thead>
          <tbody>{sessions.map((session) => <tr key={session.id} className="border-t border-border/70"><td className="px-5 py-4"><p className="font-bold text-slate-950">Buổi {session.sequence}: {session.topic}</p><p className="mt-1 text-xs text-slate-500">{session.durationMinutes} phút</p></td><td className="px-4 py-4 text-sm font-medium text-slate-700">{formatTuitionDate(session.scheduledAt)}</td><td className="px-4 py-4 text-sm font-extrabold text-slate-950">{formatTuitionCurrency(session.amount)}</td><td className="px-5 py-4"><TuitionChargeStatusBadge status={session.chargeStatus} /></td></tr>)}</tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 md:hidden">
        {sessions.map((session) => <article key={session.id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-950">Buổi {session.sequence}</h3><p className="mt-1 text-sm font-semibold text-slate-700">{session.topic}</p></div><TuitionChargeStatusBadge status={session.chargeStatus} /></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-slate-500">Thời gian</dt><dd className="mt-1 font-semibold text-slate-800">{formatTuitionDate(session.scheduledAt)}</dd></div><div><dt className="text-xs text-slate-500">Học phí</dt><dd className="mt-1 font-extrabold text-slate-950">{formatTuitionCurrency(session.amount)}</dd></div><div><dt className="text-xs text-slate-500">Thời lượng</dt><dd className="mt-1 font-semibold text-slate-800">{session.durationMinutes} phút</dd></div></dl></article>)}
      </div>
    </section>
  );
}
