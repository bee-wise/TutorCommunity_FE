"use client";

import Image from "next/image";
import { Button } from "@workspace/ui/components/ui/button";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { dashboardDateLabel } from "../utils/dashboard-schedule.utils";
import styles from "./dashboard.module.css";

export function DashboardNextSession({ session, onSelect }: { session: Session; onSelect: (session: Session, trigger: HTMLButtonElement) => void }) {
  return (
    <section className={`${styles.nextSession} relative overflow-hidden rounded-3xl border border-primary bg-primary p-5 text-primary-foreground shadow-soft sm:p-6`} aria-labelledby="dashboard-next-session">
      <div className={`${styles.nextContent} relative`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Buổi dạy kế tiếp (mẫu)</span>
          <span className="text-sm tabular-nums">{dashboardDateLabel(session.date)}</span>
        </div>
        <h2 id="dashboard-next-session" className="mt-4 font-nunito text-2xl font-extrabold leading-[1.3] sm:text-3xl">{session.subject} {session.subjectLevel}</h2>
        <p className="mt-1 text-sm leading-relaxed">{session.studentFullName}</p>
        <p className="mt-4 font-nunito text-xl font-extrabold tabular-nums">{session.startTime} - {session.endTime}</p>
        <p className="mt-1 text-xs">Mã lớp {session.classId}</p>
        <Button type="button" onClick={(event) => onSelect(session, event.currentTarget)} className="mt-5 min-h-11 rounded-full bg-accent px-5 font-bold text-accent-foreground transition-all hover:bg-highlight active:scale-[0.98] motion-reduce:transform-none">Xem buổi học</Button>
      </div>
      <Image src="/images/bee-phone.png" alt="" width={1440} height={1440} sizes="160px" className={`${styles.mascot} pointer-events-none absolute object-contain`} />
    </section>
  );
}
