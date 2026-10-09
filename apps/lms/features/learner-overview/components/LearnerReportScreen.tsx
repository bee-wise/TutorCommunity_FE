import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { LibraryClassBadge } from "../../learner-materials/components/LibraryClassBadge";
import { getLearnerLearningReport } from "../services/learner-overview.mock.service";

export function LearnerReportScreen() {
  const classes = getLearnerLearningReport();
  const totalSessions = classes.reduce((sum, item) => sum + item.sessionCount, 0);
  const completedSessions = classes.reduce((sum, item) => sum + item.completedSessionCount, 0);
  const finishedExercises = classes.reduce((sum, item) => sum + item.finishedExerciseCount, 0);
  const totalExercises = classes.reduce((sum, item) => sum + item.exerciseCount, 0);
  return <div className="mx-auto max-w-[1180px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <header className="flex flex-wrap items-center gap-3"><h1 className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary sm:text-3xl">Báo cáo học tập</h1><span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-muted-foreground">Dữ liệu minh họa</span></header>
    <section className="rounded-3xl border border-primary bg-primary px-5 py-6 text-primary-foreground shadow-soft sm:px-7" aria-labelledby="report-summary-title">
      <h2 id="report-summary-title" className="font-nunito text-lg font-extrabold">Tiến độ từ dữ liệu mẫu</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3"><ReportMetric label="Lớp học" value={`${classes.length}`} /><ReportMetric label="Buổi đã hoàn thành" value={`${completedSessions}/${totalSessions}`} /><ReportMetric label="Bài đã nộp hoặc chấm" value={`${finishedExercises}/${totalExercises}`} /></dl>
    </section>
    <section aria-labelledby="report-classes-title" className="space-y-4"><h2 id="report-classes-title" className="font-nunito text-lg font-extrabold text-primary">Theo từng lớp</h2>
      <div className="grid gap-4 md:grid-cols-2">{classes.map((item) => <article key={item.classInfo.id} className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"><div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold text-muted-foreground">{item.classInfo.code}</p><h3 className="mt-2 font-nunito text-base font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{item.classInfo.title}</h3></div><LibraryClassBadge status={item.classInfo.status} /></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4"><div><dt className="text-xs text-muted-foreground">Buổi đã học</dt><dd className="mt-1 font-nunito font-extrabold tabular-nums text-foreground">{item.completedSessionCount}/{item.sessionCount}</dd></div><div><dt className="text-xs text-muted-foreground">Bài đã hoàn thành</dt><dd className="mt-1 font-nunito font-extrabold tabular-nums text-foreground">{item.finishedExerciseCount}/{item.exerciseCount}</dd></div></dl><Button asChild variant="outline" className="mt-5 min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={`/lms/learner/classes/${encodeURIComponent(item.classInfo.id)}`}>Xem lớp học</Link></Button></article>)}</div>
    </section>
    <p className="text-xs leading-5 text-muted-foreground">Các số liệu chỉ tính trên buổi học và bài tập trong dữ liệu minh họa, chưa phải báo cáo chính thức từ hệ thống.</p>
  </div>;
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-primary-foreground">{label}</dt><dd className="mt-1 font-nunito text-2xl font-extrabold tabular-nums text-primary-foreground">{value}</dd></div>;
}
