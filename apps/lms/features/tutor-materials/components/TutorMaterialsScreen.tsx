"use client";

import { useTutorClassLibrary } from "../hooks/useTutorClassLibrary";
import { MaterialLibraryContent } from "./MaterialLibraryContent";
import { MaterialLibrarySkeleton } from "./MaterialLibrarySkeleton";

export function TutorMaterialsScreen({ initialSearch = "" }: { initialSearch?: string }) {
  const library = useTutorClassLibrary(initialSearch);
  if (!library.ready) return <MaterialLibrarySkeleton />;
  return (
    <MaterialLibraryContent
      cards={library.cards}
      filters={library.filters}
      counts={library.counts}
      storageError={library.storageError}
      onFiltersChange={library.updateFilters}
      onResetFilters={library.resetFilters}
    />
  );
}
