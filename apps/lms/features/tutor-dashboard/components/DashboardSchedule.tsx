"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Dialog, DialogTrigger } from "@workspace/ui/components/ui/dialog";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { DashboardSessionDialog } from "./DashboardSessionDialog";
import styles from "./dashboard.module.css";

function dateLabel(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function DashboardSchedule({ sessions }: { sessions: readonly Session[] }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const dates = [...new Set(sessions.map((session) => session.date))].slice(0, 2);
  const filters = [
    { value: "all", label: "Tất cả" },
    ...dates.map((date) => ({ value: date, label: dateLabel(date).slice(0, 5) })),
  ];
  const visibleSessions = sessions.filter((session) => filter === "all" || session.date === filter);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <section className="min-w-0 rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6" aria-labelledby="dashboard-schedule">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="dashboard-schedule" className="text-xl leading-[1.25] text-primary">Lịch dạy sắp tới</h2>
          <Link href="/lms/tutor/schedule" className={`${styles.textLink} inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold text-primary hover:underline`}>
            Xem toàn bộ <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Lịch minh họa tháng 7/2026. Chọn buổi học để xem chi tiết.</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Lọc lịch dạy theo ngày">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={`${styles.action} min-h-11 rounded-full border px-4 text-sm font-bold ${filter === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <ul className="mt-5 space-y-3" aria-live="polite">
          {visibleSessions.map((session, index) => (
            <li key={session.id}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={(event) => {
                    returnFocusRef.current = event.currentTarget;
                    setSelected(session);
                  }}
                  className={`${styles.interactive} ${styles.textLink} flex w-full flex-col gap-3 rounded-3xl border bg-card p-4 text-left shadow-soft sm:flex-row sm:items-center sm:gap-5 ${index === 0 ? "border-primary" : "border-border"}`}
                  aria-label={`Chi tiết ${session.subject} ${session.subjectLevel}, ${session.studentFullName}, ${dateLabel(session.date)}, ${session.startTime}`}
                >
                  <span className="flex shrink-0 items-center gap-2 sm:w-20 sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-lg font-bold tabular-nums text-primary">{session.startTime}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">{dateLabel(session.date).slice(0, 5)}</span>
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="block font-nunito text-lg font-extrabold leading-[1.25] text-foreground">{session.subject} {session.subjectLevel}</span>
                    <span className="block text-sm text-muted-foreground">{session.studentFullName}</span>
                    <span className="block text-xs tabular-nums text-muted-foreground">{session.classId} · {session.startTime} - {session.endTime}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-sm font-bold text-primary">
                    Chi tiết <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </span>
                </button>
              </DialogTrigger>
            </li>
          ))}
        </ul>
        {visibleSessions.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-bold text-primary">Chưa có buổi học trong ngày này</p>
            <p className="mt-2 text-sm text-muted-foreground">Chọn ngày khác hoặc xem toàn bộ lịch dạy.</p>
          </div>
        )}
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Hiển thị tối đa 5 buổi theo trạng thái sắp diễn ra trong dữ liệu mẫu.</p>
      </section>
      {selected && <DashboardSessionDialog session={selected} returnFocusRef={returnFocusRef} />}
    </Dialog>
  );
}
