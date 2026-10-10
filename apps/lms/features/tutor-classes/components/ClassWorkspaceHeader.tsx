import type { TutorClass } from "../types/classes.types";
import { classHeading } from "./classes-ui";

export function ClassWorkspaceHeader({
  classInfo,
  title,
}: {
  classInfo: TutorClass;
  title: string;
}) {
  return (
    <header className="space-y-3">
      <h1 className={`${classHeading} [overflow-wrap:anywhere]`}>{title}</h1>
      {classInfo.status === "completed" && (
        <p
          className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary"
          role="status"
        >
          Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.
        </p>
      )}
    </header>
  );
}
