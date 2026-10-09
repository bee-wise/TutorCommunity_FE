"use client";

import { useMemo, useState } from "react";
import { LEARNER_CLASSES } from "../../learner-materials/data/learner-materials.mock";
import { DEFAULT_CLASS_FILTERS } from "../../learner-materials/utils/learner-materials.utils";
import type { ClassLibraryFilters, LearnerClassSessionStatus } from "../../learner-materials/types/learner-materials.types";
import { getLearnerClassSummaries, getLearnerWorkspaceSessions } from "../services/learner-classes.mock.service";
import { filterLearnerClasses, filterLearnerSessions } from "../utils/learner-class-filter.utils";

export function useLearnerClassDirectory(initialKind?: string) {
  const [filters, setFilters] = useState<ClassLibraryFilters>(() => ({ ...DEFAULT_CLASS_FILTERS, kind: initialKind === "group" ? "group" : "individual" }));
  const classes = useMemo(() => getLearnerClassSummaries(), []);
  const filteredClasses = useMemo(() => filterLearnerClasses(classes, filters), [classes, filters]);
  const subjects = useMemo(() => [...new Set(LEARNER_CLASSES.map((item) => item.subject))], []);
  const counts = useMemo(() => ({ individual: LEARNER_CLASSES.filter((item) => item.kind === "individual").length, group: LEARNER_CLASSES.filter((item) => item.kind === "group").length }), []);
  return {
    filters, filteredClasses, subjects, counts,
    hasFilters: Boolean(filters.search || filters.subject !== "all" || filters.status !== "all" || filters.sort !== "newest"),
    updateFilters: (patch: Partial<ClassLibraryFilters>) => setFilters((current) => ({ ...current, ...patch })),
    resetFilters: () => setFilters((current) => ({ ...DEFAULT_CLASS_FILTERS, kind: current.kind })),
  };
}

export function useLearnerClassSessions(classId: string) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | LearnerClassSessionStatus>("all");
  const sessions = useMemo(() => getLearnerWorkspaceSessions(classId), [classId]);
  const filteredSessions = useMemo(() => filterLearnerSessions(sessions, search, status), [sessions, search, status]);
  return { sessions, filteredSessions, search, status, setSearch, setStatus };
}
