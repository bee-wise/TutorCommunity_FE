import type { LearnerSession } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";

interface UpcomingClassesPanelProps {
  sessions: LearnerSession[];
  onSelect: (session: LearnerSession) => void;
}

export function UpcomingClassesPanel({ sessions, onSelect }: UpcomingClassesPanelProps) {
  return (
    <aside className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5" aria-labelledby="upcoming-classes-title">
      <div className="flex items-start justify-between gap-3">
        <div><h2 id="upcoming-classes-title" className="text-lg font-extrabold">Lịch học sắp tới</h2><p className="mt-1 text-xs text-muted-foreground">Các buổi gần nhất cần chuẩn bị.</p></div>
        <span className="rounded-full bg-[#280F91]/8 px-2.5 py-1 text-xs font-bold text-[#280F91]">{sessions.length} buổi</span>
      </div>
      <div className="mt-4 space-y-3">
        {sessions.map((session, index) => (
          <button key={session.id} type="button" onClick={() => onSelect(session)} className="w-full rounded-xl border border-border p-3.5 text-left transition-colors hover:border-[#280F91]/20 hover:bg-muted/20">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] text-xs font-extrabold text-[#280F91]">{session.tutorInitials}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-extrabold">{session.subject}</p>{index === 0 && <span className="shrink-0 rounded-full bg-[#FFC500]/15 px-2 py-0.5 text-[10px] font-bold text-[#905B0F]">Gần nhất</span>}</div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{session.topic}</p>
                <p className="mt-2 text-xs font-semibold text-[#280F91]">{formatLearnerSessionDate(session.date)} • {session.startTime}-{session.endTime}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{session.tutorName}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
