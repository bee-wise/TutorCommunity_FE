"use client";

import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { LmsHeroBanner, LmsHeroProgress } from "../../../components/LmsHeroBanner";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { ClassMissingState } from "./ClassMissingState";
import { ApiSessionList } from "./ApiSessionList";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { classPage } from "./classes-ui";

/** Sessions screen of a class. Subject, level and status live in the class sidebar, so no header repeats them here. */
export function ClassSessionsScreen({ classId }: { classId: string }) {
  const { classInfo, loading, error, retry } = useTutorClassDetail(classId);

  if (loading) return <ClassWorkspaceSkeleton />;
  if (error) return <ClassQueryErrorState error={error} onRetry={retry} detail />;
  if (!classInfo) return <ClassMissingState />;

  const details = classInfo.serverDetails;
  const remaining = details ? Math.max(0, details.numberOfSessions - details.sessionCount) : 0;

  return (
    <div className={classPage}>
      {classInfo.status === "completed" && (
        <div role="status" className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary">
          <CheckBadgeIcon className="size-5 shrink-0" aria-hidden="true" />
          <p>Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.</p>
        </div>
      )}

      {details && (
        <LmsHeroBanner
          title="Buổi học & điểm danh"
          description={details.features.attendance ? "Theo dõi lịch dạy và điểm danh từng buổi của lớp." : "Theo dõi lịch các buổi học của lớp."}
          mascot="pencil"
        >
          <LmsHeroProgress
            label="Số buổi đã lên lịch so với kế hoạch"
            value={details.sessionCount}
            max={details.numberOfSessions}
            note={remaining > 0 ? `Còn ${remaining} buổi chưa xếp` : "Đã xếp đủ lịch"}
          />
        </LmsHeroBanner>
      )}

      <ApiSessionList key={classId} classInfo={classInfo} />
    </div>
  );
}
