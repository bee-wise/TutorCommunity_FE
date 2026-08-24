import Link from "next/link";
import { CheckCircle, MagicWand, WarningCircle } from "@phosphor-icons/react";
import type { LearningSession, TutorMaterial } from "../types";
import { formatMaterialDate } from "../utils/materials.utils";

interface SessionCoveragePanelProps {
  sessions: LearningSession[];
  materials: TutorMaterial[];
}

export function SessionCoveragePanel({ sessions, materials }: SessionCoveragePanelProps) {
  return (
    <aside className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5" aria-labelledby="session-coverage-title">
      <h2 id="session-coverage-title" className="text-lg font-extrabold">Tài liệu theo buổi học</h2>
      <p className="mt-1 text-xs text-muted-foreground">Các buổi hoàn thành nhưng chưa có tài liệu sẽ được nhắc tại đây.</p>
      <div className="mt-4 space-y-3">
        {sessions.map((session) => {
          const sessionMaterials = materials.filter((material) => material.sessionId === session.id);
          const isMissing = session.completed && sessionMaterials.length === 0;
          return (
            <article key={session.id} className={`rounded-xl border p-3.5 ${isMissing ? "border-[#FFC500]/40 bg-[#FFC500]/8" : "border-border"}`}>
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-sm font-extrabold">{session.subject}</p><p className="mt-0.5 text-xs text-muted-foreground">{session.topic}</p></div>
                {isMissing ? <WarningCircle size={18} weight="fill" className="shrink-0 text-[#905B0F]" /> : <CheckCircle size={18} weight="fill" className="shrink-0 text-[#447353]" />}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{formatMaterialDate(session.taughtAt)} • {session.durationMinutes} phút</p>
              {isMissing ? (
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#905B0F]">Chưa tạo hoặc tải tài liệu</span>
                  <Link href={`/lms/tutor/materials/${session.id}`} className="inline-flex items-center gap-1 rounded-lg bg-[#280F91] px-2.5 py-1.5 text-xs font-bold text-white"><MagicWand size={14} weight="fill" /> Tạo AI</Link>
                </div>
              ) : <p className="mt-2 text-xs font-semibold text-[#447353]">{sessionMaterials.length} tài liệu đã gắn</p>}
            </article>
          );
        })}
      </div>
    </aside>
  );
}
