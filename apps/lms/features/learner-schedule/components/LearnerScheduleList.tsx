import { CalendarDaysIcon as CalendarBlank } from "@heroicons/react/24/outline";
import type { LearnerSession } from "../types/learner-schedule.types";
import { LEARNER_STATUS_LABELS } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";
import { statusTone } from "../../../components/lms-status";

const STATUS_STYLE = {
  UPCOMING: `border ${statusTone.pending}`,
  IN_PROGRESS: `border ${statusTone.active}`,
  COMPLETED: `border ${statusTone.done}`,
  CANCELED: `border ${statusTone.cancelled}`,
  RESCHEDULED: `border ${statusTone.planned}`,
} as const;

interface LearnerScheduleListProps {
  sessions: LearnerSession[];
  onSelect: (session: LearnerSession) => void;
}

export function LearnerScheduleList({
  sessions,
  onSelect,
}: LearnerScheduleListProps) {
  const nowIso = new Date().toISOString();

  const upcoming = sessions
    .filter((s) => {
      if (s.status === "IN_PROGRESS") return true;
      if (s.status === "UPCOMING") {
        if (s.startAt) return s.startAt >= nowIso;
        return true;
      }
      return false;
    })
    .sort(compareAscending);

  const history = sessions
    .filter((s) => {
      if (
        s.status === "COMPLETED" ||
        s.status === "CANCELED" ||
        s.status === "RESCHEDULED"
      ) {
        return true;
      }
      if (s.status === "UPCOMING" && s.startAt && s.startAt < nowIso) {
        return true;
      }
      return false;
    })
    .sort(compareDescending);

  if (sessions.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-primary/20 bg-card p-6 text-center">
        <div>
          <CalendarBlank
            className="mx-auto text-primary"
            width={30}
            height={30}
          />
          <h2 className="mt-3 text-lg font-extrabold">
            Không có lịch học phù hợp
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hãy thay đổi môn học hoặc trạng thái đang lọc.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" aria-label="Lịch học dạng danh sách">
      {upcoming.length > 0 ? (
        <SessionGroup
          title="Các buổi tiếp theo"
          sessions={upcoming}
          onSelect={onSelect}
        />
      ) : null}
      {history.length > 0 ? (
        <SessionGroup
          title="Lịch sử buổi học"
          sessions={history}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}

function SessionGroup({
  title,
  sessions,
  onSelect,
}: {
  title: string;
  sessions: LearnerSession[];
  onSelect: (session: LearnerSession) => void;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5">
        <h2 className="font-extrabold">{title}</h2>
        <span className="text-xs font-bold text-muted-foreground">
          {sessions.length} buổi
        </span>
      </header>
      <div className="grid gap-2 p-2 sm:p-3">
        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelect(session)}
            className="grid gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted sm:grid-cols-[170px_minmax(0,1fr)_180px_auto] sm:items-center sm:px-4"
          >
            <div>
              <p className="text-sm font-extrabold text-foreground">
                {formatLearnerSessionDate(session.date)}
              </p>
              <p className="mt-0.5 text-xs font-bold text-primary">
                {session.startTime} - {session.endTime}
              </p>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-extrabold text-foreground truncate">
                  {session.subject} - {session.topic}
                </p>
                {session.source === "PLANNED" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border shrink-0">
                    Dự kiến
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {session.level} | {session.classCode}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:block">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-[10px] font-extrabold text-primary">
                {session.tutorInitials}
              </span>
              <p className="truncate text-xs font-semibold text-muted-foreground sm:mt-1">
                {session.tutorName}
              </p>
            </div>
            <span
              className={`w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[session.status]}`}
            >
              {LEARNER_STATUS_LABELS[session.status]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function compareAscending(a: LearnerSession, b: LearnerSession) {
  if (a.startAt && b.startAt) return a.startAt.localeCompare(b.startAt);
  return `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`);
}

function compareDescending(a: LearnerSession, b: LearnerSession) {
  if (a.startAt && b.startAt) return b.startAt.localeCompare(a.startAt);
  return `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`);
}
