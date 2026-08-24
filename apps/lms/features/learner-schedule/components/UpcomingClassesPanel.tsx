"use client";
import { CalendarBlank } from "@phosphor-icons/react";
import type { LearnerSession } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";

interface UpcomingClassesPanelProps {
  sessions: LearnerSession[];
  onSelect: (session: LearnerSession) => void;
}

export function UpcomingClassesPanel({
  sessions,
  onSelect,
}: UpcomingClassesPanelProps) {
  return (
    <aside
      className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4"
      aria-labelledby="upcoming-classes-title"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center justify-between gap-3 lg:w-48 lg:block">
          <div>
            <h2
              id="upcoming-classes-title"
              className="text-base font-extrabold"
            >
              Lịch học sắp tới
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              3 buổi gần nhất.
            </p>
          </div>
          <span className="rounded-full bg-[#280F91]/8 px-2.5 py-1 text-xs font-bold text-[#280F91] lg:mt-2 lg:inline-flex">
            {sessions.length} buổi
          </span>
        </div>
        {sessions.length > 0 ? (
          <div className="flex min-w-0 flex-1 snap-x gap-2.5 overflow-x-auto pb-1 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {sessions.map((session, index) => (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelect(session)}
                className={`min-w-[260px] snap-start rounded-xl border p-3 text-left transition-colors hover:border-[#280F91]/25 lg:min-w-0 ${index === 0 ? "border-[#FADC76] bg-[#FFF9E8]" : "border-border bg-[#F8FAFC]"}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#CFE1FA] text-[11px] font-extrabold text-[#280F91]">
                    {session.tutorInitials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-extrabold">
                        {session.subject}
                      </p>
                      {index === 0 ? (
                        <span className="shrink-0 text-[10px] font-bold text-[#905B0F]">
                          Gần nhất
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {session.topic}
                    </p>
                    <p className="mt-1.5 truncate text-xs font-semibold text-[#280F91]">
                      {formatLearnerSessionDate(session.date)} |{" "}
                      {session.startTime}-{session.endTime}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex min-h-20 flex-1 items-center justify-center gap-2 rounded-xl bg-muted/40 px-4 text-sm font-semibold text-muted-foreground">
            <CalendarBlank size={19} />
            Không có lịch sắp tới phù hợp
          </div>
        )}
      </div>
    </aside>
  );
}
