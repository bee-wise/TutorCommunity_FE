"use client";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { sessionOverlapsDate, displaySessionTime } from "../utils/learner-api-calendar";

export function LearnerClassCalendar({
  month,
  sessions,
  onSelect,
}: {
  month: string;
  sessions: ClassSessionDto[];
  onSelect: (id: string) => void;
}) {
  const [year, number] = month.split("-").map(Number),
    offset = (new Date(Date.UTC(year, number - 1, 1)).getUTCDay() + 6) % 7,
    days = new Date(Date.UTC(year, number, 0)).getUTCDate();
  return (
    <section
      aria-label="Lịch buổi học theo tháng"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
    >
      <div className="grid grid-cols-7 border-b border-border">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <span
            key={d}
            className="py-3 text-center text-xs font-bold text-muted-foreground"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => {
          const day = i - offset + 1,
            date = `${month}-${String(day).padStart(2, "0")}`,
            items = sessions.filter(s=>sessionOverlapsDate(s.startAt,s.endAt,date));
          return (
            <div
              key={i}
              className="min-h-24 min-w-0 border-b border-r border-border p-1 sm:min-h-32 sm:p-2"
            >
              {day > 0 && day <= days && (
                <>
                  <p className="mb-1 text-right text-xs font-bold">{day}</p>
                  {items.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelect(s.id)}
                      title={displaySessionTime(s.startAt, s.endAt)}
                      aria-label={`Buổi học ngày ${date}, ${displaySessionTime(s.startAt,s.endAt)}`}
                      className={`mb-1 min-h-11 w-full truncate rounded-xl border border-border px-1 text-xs font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring ${s.status === "ONGOING" ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}
                    >
                      {displaySessionTime(s.startAt, s.endAt).split(" - ")[0]}
                    </button>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
