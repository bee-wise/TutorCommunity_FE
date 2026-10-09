import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { formatLibraryDate } from "../../learner-materials/utils/learner-materials.utils";
import { getLearnerClassSummary, getLearnerWorkspaceSessions } from "../services/learner-classes.mock.service";
import { getLearnerWorkspaceLinks } from "../utils/learner-class-workspace.utils";
import { LearnerClassMissingState } from "./LearnerClassMissingState";

export function LearnerClassOverviewScreen({ classId }: { classId: string }) {
  const summary = getLearnerClassSummary(classId);
  if (!summary) return <LearnerClassMissingState />;
  const sessions = getLearnerWorkspaceSessions(classId);
  const nextSession = sessions.find((item) => item.session.status === "UPCOMING");
  const links = getLearnerWorkspaceLinks(classId);
  return <div className="mx-auto max-w-[1180px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <header className="flex flex-wrap items-center gap-3"><h1 className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary sm:text-3xl">Thông tin lớp</h1><span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-muted-foreground">Dữ liệu minh họa</span></header>
    {summary.classInfo.status === "completed" && <p className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground">Lớp đã kết thúc. Bạn vẫn có thể xem lại buổi học, tài liệu, bài tập và học phí.</p>}
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="min-w-0 space-y-5">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6" aria-labelledby="learner-class-facts">
          <h2 id="learner-class-facts" className="font-nunito text-lg font-extrabold text-primary">Chi tiết lớp</h2>
          <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <Fact label="Môn học" value={summary.classInfo.subject} /><Fact label="Trình độ" value={summary.classInfo.level} />
            <Fact label="Loại lớp" value={summary.classInfo.kind === "group" ? "Lớp nhóm" : "Lớp 1:1"} /><Fact label="Lịch học" value={summary.classInfo.scheduleLabel} />
            <Fact label="Ngày bắt đầu" value={formatLibraryDate(summary.classInfo.startedAt)} /><Fact label="Buổi đã hoàn thành" value={`${summary.completedSessionCount}/${summary.sessionCount} buổi trong dữ liệu mẫu`} />
          </dl>
        </section>
        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6" aria-labelledby="learner-next-session">
          <h2 id="learner-next-session" className="font-nunito text-lg font-extrabold text-primary">Buổi học</h2>
          {nextSession && summary.classInfo.status !== "completed" ? <div className="mt-4 space-y-2"><span className="rounded-full border border-accent bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">Sắp diễn ra</span><h3 className="pt-1 font-nunito text-base font-extrabold text-primary">{nextSession.session.topic}</h3><p className="text-sm text-muted-foreground">Buổi {nextSession.session.sequence}, {formatLibraryDate(nextSession.session.taughtAt)}</p></div>
            : <p className="mt-3 text-sm text-muted-foreground">{summary.classInfo.status === "completed" ? "Xem lại lịch sử buổi học của lớp." : "Chưa có buổi học tiếp theo trong dữ liệu mẫu."}</p>}
          <Button asChild variant="outline" className="mt-5 min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={links.sessions}>Xem buổi học</Link></Button>
        </section>
      </div>
      <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6" aria-labelledby="learner-class-tutor">
        <h2 id="learner-class-tutor" className="font-nunito text-lg font-extrabold text-primary">Gia sư phụ trách</h2>
        <div className="mt-4 flex items-center gap-3"><span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-nunito text-sm font-extrabold text-primary-foreground">{summary.classInfo.tutorInitials}</span><p className="font-bold text-foreground">{summary.classInfo.tutorName}</p></div>
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm"><Fact label="Tài liệu" value={`${summary.materialCount} tài liệu`} /><Fact label="Bài cần làm" value={`${summary.pendingExerciseCount} bài`} /></dl>
        <div className="mt-5 flex flex-wrap gap-2"><Button asChild variant="outline" className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={links.materials}>Xem tài liệu</Link></Button><Button asChild variant="outline" className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={links.exercises}>Xem bài tập</Link></Button></div>
      </section>
    </div>
  </div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 space-y-1"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-sm font-bold text-foreground [overflow-wrap:anywhere]">{value}</dd></div>;
}
