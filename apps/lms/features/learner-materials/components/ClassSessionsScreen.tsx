"use client";

import { useClassSessions } from "../hooks/useLearnerMaterials";
import { ClassSessionList } from "./ClassSessionList";
import { SessionLibraryFilters } from "./ChildLibraryFilters";
import { LibraryClassBadge } from "./LibraryClassBadge";
import { LibraryPageHeader } from "./LibraryPageHeader";
import { LibraryResultsHeader } from "./LibraryResultsHeader";
import { LibraryMissingState } from "./LibraryStates";
import { libraryPage, libraryPanel } from "./learner-materials-ui";

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const library = useClassSessions(classId);

  if (!library.classInfo) {
    return <LibraryMissingState title="Không tìm thấy lớp học" href="/lms/learner/materials" />;
  }

  return (
    <div className={libraryPage}>
      <LibraryPageHeader title={library.classInfo.title} description="Chọn buổi học để xem tài liệu gia sư đã chia sẻ với lớp." backHref={`/lms/learner/materials?kind=${library.classInfo.kind}`} backLabel="Kho tài liệu" />
      <div className={`${libraryPanel} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">{library.classInfo.tutorInitials}</span><div className="min-w-0"><p className="text-sm font-bold [overflow-wrap:anywhere]">{library.classInfo.tutorName}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{library.classInfo.scheduleLabel}</p></div></div>
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-muted-foreground">{library.classInfo.code}</span><LibraryClassBadge status={library.classInfo.status} /></div>
      </div>
      <SessionLibraryFilters filters={library.filters} onChange={library.updateFilters} />
      <section aria-labelledby="class-sessions-title" className="space-y-4">
        <LibraryResultsHeader id="class-sessions-title" title="Danh sách buổi học" count={library.filteredSessions.length} unit="buổi" onReset={library.hasFilters ? library.resetFilters : undefined} />
        <ClassSessionList classId={classId} sessions={library.filteredSessions} onReset={library.hasFilters ? library.resetFilters : undefined} />
      </section>
    </div>
  );
}
