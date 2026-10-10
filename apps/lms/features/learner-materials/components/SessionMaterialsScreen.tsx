"use client";

import { useSessionMaterials } from "../hooks/useLearnerMaterials";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { MaterialDetailDialog } from "./MaterialDetailDialog";
import { SharedMaterialList } from "./SharedMaterialList";
import { SharedLibraryFilters } from "./ChildLibraryFilters";
import { LibraryPageHeader } from "./LibraryPageHeader";
import { LibraryResultsHeader } from "./LibraryResultsHeader";
import { LibraryMissingState } from "./LibraryStates";
import { libraryPage, libraryPanel } from "./learner-materials-ui";

export function SessionMaterialsScreen({ classId, sessionId }: { classId: string; sessionId: string }) {
  const library = useSessionMaterials(classId, sessionId);

  if (!library.classInfo || !library.session) {
    return <LibraryMissingState title="Không tìm thấy buổi học" href="/lms/learner/materials" />;
  }

  return (
    <div className={libraryPage}>
      <LibraryPageHeader title={library.session.topic} description={`Tài liệu của buổi ${library.session.sequence}`} backHref={`/lms/learner/materials/classes/${encodeURIComponent(classId)}`} backLabel="Danh sách buổi học" />
      <div className={`${libraryPanel} flex flex-wrap items-center justify-between gap-3 text-sm`}>
        <p className="font-semibold [overflow-wrap:anywhere]">{library.classInfo.tutorName}</p><p className="text-muted-foreground">{formatLibraryDate(library.session.taughtAt)} · {library.session.durationMinutes} phút</p>
      </div>
      <SharedLibraryFilters filters={library.filters} onChange={library.updateFilters} />
      <section aria-labelledby="shared-materials-title" className="space-y-4">
        <LibraryResultsHeader id="shared-materials-title" title="Tài liệu được chia sẻ" count={library.filteredMaterials.length} unit="tài liệu" onReset={library.hasFilters ? library.resetFilters : undefined} />
        <SharedMaterialList materials={library.filteredMaterials} onView={library.viewMaterial} onReset={library.hasFilters ? library.resetFilters : undefined} />
      </section>
      <MaterialDetailDialog material={library.selectedMaterial} onClose={library.closeMaterial} />
    </div>
  );
}
