import Link from "next/link";
import {
  ArrowRight,
  FileArrowUp,
  FolderOpen,
  WarningCircle,
} from "@phosphor-icons/react";
import type { Learner, LearnerMaterialSummary } from "../types";
import { formatMaterialDate } from "../utils/materials.utils";

interface LearnerMaterialsListProps {
  summaries: LearnerMaterialSummary[];
  onUpload: (learner: Learner) => void;
}

export function LearnerMaterialsList({ summaries, onUpload }: LearnerMaterialsListProps) {
  if (summaries.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#280F91]/20 bg-white p-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-[#280F91]">
            <FolderOpen size={25} weight="duotone" aria-hidden="true" />
          </span>
          <h2 className="mt-3 text-lg font-extrabold">Không tìm thấy học viên</h2>
          <p className="mt-1 text-sm text-muted-foreground">Hãy đổi tên, môn học hoặc trạng thái tài liệu.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="learner-materials-title">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h2 id="learner-materials-title" className="text-lg font-extrabold">Danh sách học viên</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Mỗi học viên có thể có nhiều buổi học, môn học và tài liệu riêng.</p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-muted/55 text-xs text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Học viên</th>
              <th className="px-4 py-3 font-semibold">Môn đang học</th>
              <th className="px-4 py-3 font-semibold">Buổi đã học</th>
              <th className="px-4 py-3 font-semibold">Tài liệu</th>
              <th className="px-4 py-3 font-semibold">Nhắc nhở</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary) => (
              <tr key={summary.learner.id} className="border-t border-border/70 transition-colors hover:bg-muted/25">
                <td className="px-5 py-4"><LearnerIdentity summary={summary} /></td>
                <td className="px-4 py-4"><SubjectTags subjects={summary.subjects} /></td>
                <td className="px-4 py-4 font-semibold">{summary.sessionCount}</td>
                <td className="px-4 py-4 font-semibold">{summary.materialCount}</td>
                <td className="px-4 py-4"><ReminderTag count={summary.missingMaterialCount} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => onUpload(summary.learner)} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 font-semibold text-[#447353] hover:bg-[#447353]/8">
                      <FileArrowUp size={17} weight="bold" /> Tải lên
                    </button>
                    <Link href={`/lms/tutor/materials/learner/${summary.learner.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 font-semibold text-[#280F91] hover:bg-[#280F91]/8">
                      Xem tài liệu <ArrowRight size={15} weight="bold" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {summaries.map((summary) => (
          <article key={summary.learner.id} className="rounded-xl border border-border p-4">
            <LearnerIdentity summary={summary} />
            <div className="mt-3"><SubjectTags subjects={summary.subjects} /></div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Buổi đã học</dt><dd className="mt-1 font-bold">{summary.sessionCount}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Tài liệu</dt><dd className="mt-1 font-bold">{summary.materialCount}</dd></div>
            </dl>
            <div className="mt-3"><ReminderTag count={summary.missingMaterialCount} /></div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <button type="button" onClick={() => onUpload(summary.learner)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#447353]/25 font-bold text-[#447353]">
                <FileArrowUp size={17} weight="bold" /> Tải lên
              </button>
              <Link href={`/lms/tutor/materials/learner/${summary.learner.id}`} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#280F91] font-bold text-white">
                Xem tài liệu <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LearnerIdentity({ summary }: { summary: LearnerMaterialSummary }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] font-nunito text-sm font-extrabold text-[#280F91]">{summary.learner.initials}</span>
      <div><p className="font-bold text-foreground">{summary.learner.fullName}</p><p className="mt-0.5 text-xs text-muted-foreground">{summary.learner.gradeLevel} • Gần nhất {formatMaterialDate(summary.latestSessionAt).slice(0, 10)}</p></div>
    </div>
  );
}

function SubjectTags({ subjects }: { subjects: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{subjects.map((subject) => <span key={subject} className="rounded-full bg-[#280F91]/8 px-2 py-1 text-xs font-bold text-[#280F91]">{subject}</span>)}</div>;
}

function ReminderTag({ count }: { count: number }) {
  if (count === 0) return <span className="text-xs font-semibold text-[#447353]">Đã đủ tài liệu</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-[#FFC500]/15 px-2.5 py-1 text-xs font-bold text-[#905B0F]"><WarningCircle size={14} weight="bold" /> {count} buổi chưa có tài liệu</span>;
}
