"use client";

import { useMemo, useState } from "react";
import { CLASS_LEARNERS, CLASS_SESSIONS, MATERIAL_CLASSES } from "../data/classroom.mock";
import type { MaterialLibraryFilters } from "../types/material-library.types";
import { filterMaterialClasses } from "../utils/class-library.utils";
import { getMaterialLibraryCard } from "../utils/material-library.utils";
import { useClassMaterials } from "./useClassMaterials";

const DEFAULT_FILTERS: MaterialLibraryFilters = { kind: "individual", search: "", status: "all", sort: "newest" };
const CLASS_COUNTS = {
  individual: MATERIAL_CLASSES.filter((item) => item.kind === "individual").length,
  group: MATERIAL_CLASSES.filter((item) => item.kind === "group").length,
};

export function useTutorClassLibrary(initialSearch = "") {
  const { materials, ready, storageError } = useClassMaterials();
  const [filters, setFilters] = useState<MaterialLibraryFilters>({ ...DEFAULT_FILTERS, search: initialSearch });
  const classes = useMemo(() => filterMaterialClasses(MATERIAL_CLASSES, CLASS_LEARNERS, filters), [filters]);
  const cards = useMemo(() => classes.map((classInfo) => getMaterialLibraryCard(classInfo, CLASS_LEARNERS, CLASS_SESSIONS, materials)), [classes, materials]);

  return {
    ready, storageError, cards, filters, counts: CLASS_COUNTS,
    updateFilters(patch: Partial<MaterialLibraryFilters>) { setFilters((current) => ({ ...current, ...patch })); },
    resetFilters() { setFilters((current) => ({ ...DEFAULT_FILTERS, kind: current.kind })); },
  };
}
