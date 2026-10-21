import Link from "next/link";
import { ArrowRightIcon as ArrowRight, BookOpenIcon as Books } from "@heroicons/react/24/outline";
import type { LearnerExerciseClassStatus, LearnerExerciseClassSummary } from "../types/learner-exercises.types";
import { formatExerciseDay } from "../utils/learner-exercises.utils";

const CLASS_STATUS: Record<LearnerExerciseClassStatus, { label: string; className: string }> = {
  active: { label: "Đang học", className: "bg-secondary/15 text-foreground" },
  upcoming: { label: "Sắp khai giảng", className: "bg-accent/15 text-warning" },
  paused: { label: "Tạm dừng", className: "bg-accent/15 text-warning" },
  completed: { label: "Đã hoàn thành", className: "bg-muted text-muted-foreground" },
};

export function ExerciseClassList({ classes }: { classes: LearnerExerciseClassSummary[] }) {
  if (classes.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-labelledby="exercise-classes-title">
      <header className="mb-4">
        <h2 id="exercise-classes-title" className="text-lg font-extrabold text-foreground">Lớp học của bạn</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Chọn lớp để tiếp tục đến danh sách buổi học.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((summary) => <ExerciseClassCard key={summary.classInfo.id} summary={summary} />)}
      </div>
    </section>
  );
}

function ExerciseClassCard({ summary }: { summary: LearnerExerciseClassSummary }) {
  const classInfo = summary.classInfo;
  const status = CLASS_STATUS[classInfo.status];

  return (
    <article className="flex h-full min-h-[390px] flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-primary/25">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-sm font-extrabold text-primary">{classInfo.tutorInitials}</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
      </div>

      <p className="mt-4 text-xs font-bold text-primary">Mã lớp: {classInfo.classCode}</p>
      <h3 className="mt-1.5 text-lg font-extrabold leading-6 text-foreground">{classInfo.name}</h3>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">{classInfo.tutorName}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
        <Info label="Môn học" value={classInfo.subject} />
        <Info label="Trình độ" value={classInfo.level} />
        <Info label="Lịch học" value={classInfo.scheduleLabel} wide />
        <Info label="Ngày bắt đầu" value={formatExerciseDay(classInfo.startedAt)} />
      </dl>

      <dl className="mt-4 grid grid-cols-3 rounded-xl bg-muted px-3 py-3 text-center">
        <Metric label="Buổi học" value={summary.sessionCount} />
        <Metric label="Bài tập" value={summary.exerciseCount} />
        <Metric label="Cần làm" value={summary.pendingExerciseCount} accent={summary.pendingExerciseCount > 0} />
      </dl>

      <Link href={`/lms/learner/exercises/classes/${classInfo.id}`} className="mt-auto inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90">
        Xem buổi học <ArrowRight width={15} height={15} />
      </Link>
    </article>
  );
}

function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={wide ? "col-span-2" : undefined}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-0.5 font-bold leading-5 text-foreground">{value}</dd></div>;
}

function Metric({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return <div><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className={`mt-0.5 text-base font-extrabold ${accent ? "text-warning" : "text-foreground"}`}>{value}</dd></div>;
}

function EmptyState() {
  return <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-primary/20 bg-card p-6 text-center"><div><Books className="mx-auto text-primary" width={30} height={30} /><h2 className="mt-3 text-lg font-extrabold text-foreground">Không tìm thấy lớp học</h2><p className="mt-1 text-sm text-muted-foreground">Hãy thay đổi từ khóa hoặc môn học đang lọc.</p></div></div>;
}
