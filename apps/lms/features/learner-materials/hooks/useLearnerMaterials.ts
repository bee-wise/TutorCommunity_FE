"use client";

import { useMemo, useState } from "react";
import {
  LEARNER_CLASSES,
  LEARNER_CLASS_SESSIONS,
  LEARNER_SHARED_MATERIALS,
} from "../data/learner-materials.mock";
import type { ClassLibraryFilters, ClassSessionFilters, LearnerSharedMaterial, SessionMaterialFilters } from "../types/learner-materials.types";
import {
  buildClassSummaries, buildSessionSummaries, DEFAULT_CLASS_FILTERS, DEFAULT_MATERIAL_FILTERS, DEFAULT_SESSION_FILTERS,
  filterClassSummaries, filterSessionSummaries, filterSharedMaterials,
} from "../utils/learner-materials.utils";

export function useClassLibrary(initialKind?: string) {
  const [filters, setFilters] = useState<ClassLibraryFilters>(() => ({ ...DEFAULT_CLASS_FILTERS, kind: initialKind === "group" ? "group" : "individual" }));
  const summaries = useMemo(
    () => buildClassSummaries(LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS),
    [],
  );
  const subjects = useMemo(() => [...new Set(LEARNER_CLASSES.map((item) => item.subject))], []);
  const counts = useMemo(() => ({ individual: LEARNER_CLASSES.filter((item) => item.kind === "individual").length, group: LEARNER_CLASSES.filter((item) => item.kind === "group").length }), []);
  const filteredClasses = useMemo(() => filterClassSummaries(summaries, filters), [summaries, filters]);
  return {
    filters, filteredClasses, subjects, counts,
    hasFilters: Boolean(filters.search || filters.subject !== "all" || filters.status !== "all" || filters.sort !== "newest"),
    updateFilters: (patch: Partial<ClassLibraryFilters>) => setFilters((current) => ({ ...current, ...patch })),
    resetFilters: () => setFilters((current) => ({ ...DEFAULT_CLASS_FILTERS, kind: current.kind })),
  };
}

export function useClassSessions(classId: string) {
  const [filters, setFilters] = useState<ClassSessionFilters>(DEFAULT_SESSION_FILTERS);
  const classInfo = LEARNER_CLASSES.find((item) => item.id === classId);
  const summaries = useMemo(() => buildSessionSummaries(classId, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS), [classId]);
  const filteredSessions = useMemo(() => filterSessionSummaries(summaries, filters), [summaries, filters]);
  return {
    classInfo, filteredSessions, filters,
    hasFilters: Boolean(filters.search || filters.status !== "all" || filters.availability !== "all"),
    updateFilters: (patch: Partial<ClassSessionFilters>) => setFilters((current) => ({ ...current, ...patch })),
    resetFilters: () => setFilters(DEFAULT_SESSION_FILTERS),
  };
}

export function useSessionMaterials(classId: string, sessionId: string) {
  const [filters, setFilters] = useState<SessionMaterialFilters>(DEFAULT_MATERIAL_FILTERS);
  const [selectedId, setSelectedId] = useState<string>();
  const classInfo = LEARNER_CLASSES.find((item) => item.id === classId);
  const session = LEARNER_CLASS_SESSIONS.find(
    (item) => item.id === sessionId && item.classId === classId,
  );
  // Learner mock data contains published documents only; never read the tutor draft store.
  const materials = useMemo(() => classInfo && session ? LEARNER_SHARED_MATERIALS.filter((material) => material.sessionId === session.id) : [], [classInfo, session]);
  const filteredMaterials = useMemo(() => filterSharedMaterials(sessionId, materials, filters), [sessionId, materials, filters]);
  return {
    classInfo, session, filters, filteredMaterials,
    selectedMaterial: materials.find((material) => material.id === selectedId),
    hasFilters: Boolean(filters.search || filters.source !== "all" || filters.fileType !== "all"),
    updateFilters: (patch: Partial<SessionMaterialFilters>) => setFilters((current) => ({ ...current, ...patch })),
    resetFilters: () => setFilters(DEFAULT_MATERIAL_FILTERS),
    viewMaterial: (material: LearnerSharedMaterial) => setSelectedId(material.id),
    closeMaterial: () => setSelectedId(undefined),
  };
}

