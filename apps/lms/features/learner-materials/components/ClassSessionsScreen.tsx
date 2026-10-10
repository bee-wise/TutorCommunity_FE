"use client";

import { useClassSessions } from "../hooks/useLearnerMaterials";
import { ClassSessionList } from "./ClassSessionList";
import { SessionLibraryFilters } from "./ChildLibraryFilters";
import { LibraryPageHeader } from "./LibraryPageHeader";
import { LibraryResultsHeader } from "./LibraryResultsHeader";
import { LibraryMissingState } from "./LibraryStates";
import { libraryPage } from "./learner-materials-ui";

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const library = useClassSessions(classId);

  if (!library.classInfo) {
    return <LibraryMissingState title="Không tìm thấy lớp học" href="/lms/learner/classes" />;
  }

  return (
    <div className={libraryPage}>
      <LibraryPageHeader title="Tài liệu lớp học" description="Chọn buổi học để xem tài liệu gia sư đã chia sẻ với lớp." backHref={`/lms/learner/classes/${encodeURIComponent(classId)}`} backLabel="Thông tin lớp" />
      <SessionLibraryFilters filters={library.filters} onChange={library.updateFilters} />
      <section aria-labelledby="class-sessions-title" className="space-y-4">
        <LibraryResultsHeader id="class-sessions-title" title="Danh sách buổi học" count={library.filteredSessions.length} unit="buổi" onReset={library.hasFilters ? library.resetFilters : undefined} />
        <ClassSessionList classId={classId} sessions={library.filteredSessions} onReset={library.hasFilters ? library.resetFilters : undefined} />
      </section>
    </div>
  );
}
