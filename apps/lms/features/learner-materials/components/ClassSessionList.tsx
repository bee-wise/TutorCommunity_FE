import Link from "next/link";
import { ArrowRight, FolderOpen } from "@phosphor-icons/react";
import type {
  LearnerClassSession,
  LearnerSharedMaterial,
} from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";

const SESSION_STATUS = {
  COMPLETED: { label: "Đã hoàn thành", className: "bg-[#447353]/10 text-[#447353]" },
  UPCOMING: { label: "Sắp diễn ra", className: "bg-[#FFC500]/15 text-[#905B0F]" },
  CANCELED: { label: "Đã hủy", className: "bg-[#E1ABA7]/20 text-[#9B5E5A]" },
} as const;

interface ClassSessionListProps {
  classId: string;
  sessions: LearnerClassSession[];
  materials: LearnerSharedMaterial[];
}

export function ClassSessionList({ classId, sessions, materials }: ClassSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#280F91]/20 bg-white p-6 text-center">
        <div><FolderOpen size={27} weight="duotone" className="mx-auto text-[#280F91]" /><h2 className="mt-3 text-lg font-extrabold">Không có buổi học phù hợp</h2><p className="mt-1 text-sm text-muted-foreground">Hãy thay đổi bộ lọc để xem các buổi học khác.</p></div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="class-sessions-title">
      <div className="border-b border-border px-4 py-4 sm:px-5"><h2 id="class-sessions-title" className="text-lg font-extrabold">Danh sách buổi học</h2><p className="mt-0.5 text-xs text-muted-foreground">Tài liệu chỉ hiển thị sau khi gia sư chia sẻ với lớp.</p></div>
      <div className="divide-y divide-border">
        {sessions.map((session) => {
          const materialCount = materials.filter((material) => material.sessionId === session.id).length;
          const status = SESSION_STATUS[session.status];
          return (
            <article key={session.id} className="p-4 transition-colors hover:bg-muted/20 sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-muted-foreground">Buổi {session.sequence}</span><span className={`rounded-full px-2 py-1 text-xs font-bold ${status.className}`}>{status.label}</span></div><h3 className="mt-2 font-extrabold">{session.topic}</h3><p className="mt-1 text-xs text-muted-foreground">{formatLibraryDate(session.taughtAt)} • {session.durationMinutes} phút</p></div>
                <div className="flex items-center justify-between gap-3 md:justify-end">
                  {materialCount > 0 ? <span className="text-sm font-bold text-[#447353]">{materialCount} tài liệu</span> : <span className="text-sm font-semibold text-muted-foreground">Chưa có tài liệu</span>}
                  {materialCount > 0 ? (
                    <Link href={`/lms/learner/materials/classes/${classId}/sessions/${session.id}`} className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#280F91] px-3 text-xs font-bold text-white hover:bg-[#280F91]/90">Xem tài liệu <ArrowRight size={14} weight="bold" /></Link>
                  ) : (
                    <button type="button" disabled className="h-9 cursor-not-allowed rounded-lg border border-input px-3 text-xs font-bold text-muted-foreground opacity-60">Chưa thể xem</button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

