import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import type {
  Learner,
  LearningSession,
  LibraryMaterialStatus,
  TutorMaterial,
} from "../types";

interface LessonContextPanelProps {
  session: LearningSession;
  learner: Learner;
  materials: TutorMaterial[];
  learnerMaterialsHref: string;
}

const statusLabels: Record<LibraryMaterialStatus, string> = {
  published: "Đã chia sẻ",
  draft: "Bản nháp",
  hidden: "Đang ẩn",
};

const statusClasses: Record<LibraryMaterialStatus, string> = {
  published: "bg-secondary text-secondary-foreground",
  draft: "border border-warning bg-card text-warning",
  hidden: "border border-border bg-card text-foreground",
};

const sessionDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function LessonContextPanel({
  session,
  learner,
  materials,
  learnerMaterialsHref,
}: LessonContextPanelProps) {
  return (
    <aside className="space-y-5" aria-label="Thông tin và tài liệu buổi học">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="lesson-info-title">
        <h2 id="lesson-info-title" className="font-nunito text-lg font-extrabold text-foreground">
          Thông tin buổi học
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Học viên</dt>
            <dd className="mt-1 text-sm font-bold text-foreground">{learner.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Môn học</dt>
            <dd className="mt-1 text-sm font-bold text-foreground">{session.subject}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Ngày học</dt>
            <dd className="mt-1 text-sm font-bold text-foreground">
              {sessionDateFormatter.format(new Date(session.taughtAt))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Thời lượng</dt>
            <dd className="mt-1 text-sm font-bold text-foreground">{session.durationMinutes} phút</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="lesson-materials-title">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="lesson-materials-title" className="font-nunito text-lg font-extrabold text-foreground">
            Tài liệu buổi học
          </h2>
          <span className="text-sm font-bold text-primary">{materials.length}</span>
        </div>

        {materials.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">
            Chưa có tài liệu cho buổi học này. Bạn có thể tạo bằng AI từ bản ghi hoặc tải lên trong thư viện học viên.
          </p>
        ) : (
          <ul className="mt-3">
            {materials.map((material) => (
              <li key={material.id} className="border-t border-border py-3 first:border-t-0">
                <p className="break-words text-sm font-bold leading-5 text-foreground">{material.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {material.source === "ai" ? "BeeWise AI" : `Tải lên ${material.fileType}`}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusClasses[material.status]}`}>
                    {statusLabels[material.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link
          href={learnerMaterialsHref}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Mở thư viện học viên
          <ArrowRight size={15} weight="bold" aria-hidden="true" />
        </Link>
      </section>
    </aside>
  );
}
