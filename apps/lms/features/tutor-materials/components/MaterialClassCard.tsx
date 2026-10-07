import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { CLASS_LEARNERS, CLASS_SESSIONS } from "../data/classroom.mock";
import { CLASS_STATUS_LABELS, type ClassMaterial, type MaterialClass } from "../types/class-materials.types";
import styles from "./MaterialClassCard.module.css";

export function MaterialClassCard({ classInfo, materials }: { classInfo: MaterialClass; materials: ClassMaterial[] }) {
  const learners = CLASS_LEARNERS.filter((item) => classInfo.learnerIds.includes(item.id));
  const sessions = CLASS_SESSIONS.filter((item) => item.classId === classInfo.id);
  const classMaterials = materials.filter((item) => item.classId === classInfo.id);
  const missing = sessions.filter((session) => session.completed && !classMaterials.some((material) => material.sessionId === session.id && material.status === "published")).length;
  return (
    <article className="h-full min-w-0">
      <Link href={`/lms/tutor/materials/classes/${classInfo.id}`}
        aria-label={`Xem tài liệu lớp ${classInfo.title}, mã ${classInfo.code}`}
        className={`${styles.card} group flex h-full min-w-0 flex-col gap-3 p-4`}>
        <header className="space-y-2">
          <h2 className="font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{classInfo.title}</h2>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">{classInfo.code}</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${classInfo.status === "active" ? "border-secondary bg-secondary text-secondary-foreground" : classInfo.status === "upcoming" ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground"}`}>
              {CLASS_STATUS_LABELS[classInfo.status]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{classInfo.subject} · {classInfo.level}</p>
        </header>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex shrink-0 -space-x-2" aria-hidden="true">
            {learners.slice(0, 3).map((learner) => <span key={learner.id} className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-card bg-primary font-nunito text-xs font-extrabold text-primary-foreground">{learner.initials}</span>)}
          </div>
          <p className="min-w-0 text-sm font-medium text-foreground [overflow-wrap:anywhere]">{classInfo.kind === "individual" ? learners[0]?.fullName : `${learners.length} học viên trong lớp`}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-muted-foreground">Buổi học</dt>
            <dd className="font-nunito text-sm font-extrabold tabular-nums text-foreground">{sessions.length}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-muted-foreground">Tài liệu</dt>
            <dd className="font-nunito text-sm font-extrabold tabular-nums text-foreground">{classMaterials.length}</dd>
          </div>
        </dl>

        <div className="mt-auto space-y-3">
          {missing > 0 && <p className="rounded-2xl border border-accent bg-accent px-3 py-2 text-xs font-semibold leading-relaxed text-accent-foreground"><strong className="font-extrabold tabular-nums">{missing} buổi</strong> chưa có tài liệu đã xuất bản</p>}
          <span className="flex min-h-11 w-full items-center justify-between gap-3 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Xem tài liệu <ArrowRight weight="bold" size={16} aria-hidden="true" className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
