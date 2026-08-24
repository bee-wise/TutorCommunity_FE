import { CalendarBlank } from "@phosphor-icons/react";
import { LEARNER_TODAY } from "../data/learner-schedule.mock";
import type { LearnerSession } from "../types/learner-schedule.types";
import { LEARNER_STATUS_LABELS } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";

const STATUS_STYLE = {
  UPCOMING: "bg-[#FFC500]/15 text-[#905B0F]",
  COMPLETED: "bg-[#447353]/10 text-[#447353]",
  CANCELED: "bg-[#E1ABA7]/18 text-[#9B5E5A]",
} as const;

interface LearnerScheduleListProps {
  sessions: LearnerSession[];
  onSelect: (session: LearnerSession) => void;
}

export function LearnerScheduleList({ sessions, onSelect }: LearnerScheduleListProps) {
  const upcoming = sessions
    .filter((session) => session.status === "UPCOMING" && session.date >= LEARNER_TODAY)
    .sort(compareAscending);
  const history = sessions
    .filter((session) => session.status !== "UPCOMING" || session.date < LEARNER_TODAY)
    .sort(compareDescending);

  if (sessions.length === 0) {
    return <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#280F91]/20 bg-white p-6 text-center"><div><CalendarBlank className="mx-auto text-[#280F91]" size={30} weight="duotone" /><h2 className="mt-3 text-lg font-extrabold">Không có lịch học phù hợp</h2><p className="mt-1 text-sm text-muted-foreground">Hãy thay đổi môn học hoặc trạng thái đang lọc.</p></div></div>;
  }

  return (
    <div className="space-y-5" aria-label="Lịch học dạng danh sách">
      {upcoming.length > 0 ? <SessionGroup title="Các buổi tiếp theo" sessions={upcoming} onSelect={onSelect} /> : null}
      {history.length > 0 ? <SessionGroup title="Lịch sử buổi học" sessions={history} onSelect={onSelect} /> : null}
    </div>
  );
}

function SessionGroup({ title, sessions, onSelect }: { title: string; sessions: LearnerSession[]; onSelect: (session: LearnerSession) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5"><h2 className="font-extrabold">{title}</h2><span className="text-xs font-bold text-muted-foreground">{sessions.length} buổi</span></header>
      <div className="grid gap-2 p-2 sm:p-3">
        {sessions.map((session) => (
          <button key={session.id} type="button" onClick={() => onSelect(session)} className="grid gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[#F8FAFC] sm:grid-cols-[170px_minmax(0,1fr)_180px_auto] sm:items-center sm:px-4">
            <div><p className="text-sm font-extrabold text-slate-900">{formatLearnerSessionDate(session.date)}</p><p className="mt-0.5 text-xs font-bold text-[#280F91]">{session.startTime} - {session.endTime}</p></div>
            <div className="min-w-0"><p className="font-extrabold text-slate-950">{session.subject} - {session.topic}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{session.level} | {session.classCode}</p></div>
            <div className="flex items-center gap-2 sm:block"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#CFE1FA] text-[10px] font-extrabold text-[#280F91]">{session.tutorInitials}</span><p className="truncate text-xs font-semibold text-slate-600 sm:mt-1">{session.tutorName}</p></div>
            <span className={`w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[session.status]}`}>{LEARNER_STATUS_LABELS[session.status]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function compareAscending(a: LearnerSession, b: LearnerSession) {
  return `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`);
}

function compareDescending(a: LearnerSession, b: LearnerSession) {
  return `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`);
}
