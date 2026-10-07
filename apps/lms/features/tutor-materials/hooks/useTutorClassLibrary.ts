"use client";
import { useMemo, useState } from "react";
import { CLASS_LEARNERS, CLASS_SESSIONS, MATERIAL_CLASSES } from "../data/classroom.mock";
import { useClassMaterials } from "./useClassMaterials";
import { filterMaterialClasses } from "../utils/class-library.utils";
import type { ClassKind, ClassSort, ClassStatus } from "../types/class-materials.types";

export function useTutorClassLibrary(initialSearch = "") {
  const { materials, ready, storageError } = useClassMaterials();
  const [kind, setKind] = useState<ClassKind>("individual");
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<"all" | ClassStatus>("all");
  const [sort, setSort] = useState<ClassSort>("newest");
  const classes = useMemo(() => filterMaterialClasses(MATERIAL_CLASSES, CLASS_LEARNERS, { kind, search, status, sort }), [kind, search, sort, status]);
  return { materials, ready, storageError, classes, kind, setKind, search, setSearch, status, setStatus, sort, setSort, sessions: CLASS_SESSIONS };
}
