"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
import { LEARNER_SESSION_STATUS_LABELS, type LearnerClassSessionStatus } from "../../learner-materials/types/learner-materials.types";
import { formatLibraryDate } from "../../learner-materials/utils/learner-materials.utils";
import { useLearnerClassSessions } from "../hooks/useLearnerClassDirectory";
import { getLearnerClassSummary } from "../services/learner-classes.mock.service";
import { LearnerClassMissingState } from "./LearnerClassMissingState";

const STATUS_OPTIONS: readonly { value: "all" | LearnerClassSessionStatus; label: string }[] = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "UPCOMING", label: "Sắp diễn ra" },
  { value: "CANCELED", label: "Đã hủy" },
];

export function LearnerClassSessionsScreen({ classId }: { classId: string }) {
  const summary = getLearnerClassSummary(classId);
  const listing = useLearnerClassSessions(classId);
  if (!summary) return <LearnerClassMissingState />;
  return <div className="mx-auto max-w-[1180px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <header><h1 className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary sm:text-3xl">Buổi học</h1></header>
    <section aria-label="Bộ lọc buổi học" className="rounded-3xl border border-border bg-card p-4 shadow-soft">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]"><LibrarySearch id="learner-class-session-search" label="Tìm buổi học" value={listing.search} placeholder="Chủ đề hoặc số buổi..." onChange={listing.setSearch} /><LibrarySelect id="learner-class-session-status" label="Trạng thái" value={listing.status} options={STATUS_OPTIONS} onChange={listing.setStatus} /></div>
    </section>
    <section aria-label="Danh sách buổi học" className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground">{listing.filteredSessions.length} buổi phù hợp</p>
      {listing.filteredSessions.length ? listing.filteredSessions.map(({ session, materialCount, exerciseCount, pendingExerciseCount }) => <article key={session.id} className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2"><p className="text-xs font-bold text-muted-foreground">Buổi {session.sequence} · {formatLibraryDate(session.taughtAt)}</p><h2 className="font-nunito text-base font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{session.topic}</h2><p className="text-sm text-muted-foreground">{session.durationMinutes} phút, {LEARNER_SESSION_STATUS_LABELS[session.status]}</p></div>
          {pendingExerciseCount > 0 && <span className="w-fit shrink-0 rounded-full border border-accent bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">{pendingExerciseCount} bài cần làm</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {materialCount > 0 ? <Button asChild variant="outline" className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={`/lms/learner/materials/classes/${encodeURIComponent(classId)}/sessions/${encodeURIComponent(session.id)}`}>Tài liệu ({materialCount})</Link></Button> : <span className="self-center text-xs text-muted-foreground">Chưa có tài liệu</span>}
          {exerciseCount > 0 && <Button asChild variant="outline" className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={`/lms/learner/exercises/classes/${encodeURIComponent(classId)}/sessions/${encodeURIComponent(session.id)}`}>Bài tập ({exerciseCount})</Link></Button>}
        </div>
      </article>) : <div className="rounded-3xl border border-border bg-card px-5 py-10 text-center shadow-soft"><h2 className="font-nunito text-lg font-extrabold text-primary">Không có buổi học phù hợp</h2><p className="mt-2 text-sm text-muted-foreground">Thử đổi từ khóa hoặc trạng thái.</p></div>}
    </section>
  </div>;
}
