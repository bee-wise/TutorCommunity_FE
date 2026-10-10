"use client";

import { useClassLibrary } from "../hooks/useLearnerMaterials";
import { ClassLibraryList } from "./ClassLibraryList";
import { ClassLibraryFilters } from "./ClassLibraryFilters";
import { LibraryPageHeader } from "./LibraryPageHeader";
import { LibraryResultsHeader } from "./LibraryResultsHeader";
import { libraryPage } from "./learner-materials-ui";

export function ClassLibraryScreen({ initialKind }: { initialKind?: string } = {}) {
  const library = useClassLibrary(initialKind);

  return (
    <div className={libraryPage}>
      <LibraryPageHeader title="Tài liệu lớp học" description="Xem tài liệu gia sư đã chia sẻ theo từng lớp và buổi học." />
      <ClassLibraryFilters filters={library.filters} subjects={library.subjects} counts={library.counts} onChange={library.updateFilters} />
      <section aria-labelledby="class-library-title" className="space-y-4">
        <LibraryResultsHeader id="class-library-title" title="Lớp học của tôi" count={library.filteredClasses.length} unit="lớp" onReset={library.hasFilters ? library.resetFilters : undefined} />
        <ClassLibraryList classes={library.filteredClasses} onReset={library.resetFilters} />
      </section>
    </div>
  );
}

