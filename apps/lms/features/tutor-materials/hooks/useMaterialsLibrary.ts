"use client";

import { useMemo, useState } from "react";
import { MOCK_LEARNERS, MOCK_MATERIALS, MOCK_SESSIONS } from "../mockData";
import type {
  LibraryMaterialStatus,
  LibraryMaterialStatusFilter,
  MaterialCoverageFilter,
  MaterialSourceFilter,
  TutorMaterial,
} from "../types";
import { buildLearnerSummaries, getMaterialFileType } from "../utils/materials.utils";

export function useMaterialsLibrary(learnerId?: string) {
  const [materials, setMaterials] = useState<TutorMaterial[]>(MOCK_MATERIALS);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [coverage, setCoverage] = useState<MaterialCoverageFilter>("all");
  const [source, setSource] = useState<MaterialSourceFilter>("all");
  const [status, setStatus] = useState<LibraryMaterialStatusFilter>("all");

  const summaries = useMemo(
    () => buildLearnerSummaries(MOCK_LEARNERS, MOCK_SESSIONS, materials),
    [materials],
  );
  const subjects = useMemo(() => {
    const scopedSessions = learnerId
      ? MOCK_SESSIONS.filter((session) => session.learnerId === learnerId)
      : MOCK_SESSIONS;
    return [...new Set(scopedSessions.map((session) => session.subject))];
  }, [learnerId]);
  const filteredLearners = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return summaries.filter((summary) => {
      const matchesName = summary.learner.fullName.toLocaleLowerCase("vi").includes(query);
      const matchesSubject = subject === "all" || summary.subjects.includes(subject);
      const matchesCoverage =
        coverage === "all" ||
        (coverage === "missing" && summary.missingMaterialCount > 0) ||
        (coverage === "complete" && summary.missingMaterialCount === 0);
      return matchesName && matchesSubject && matchesCoverage;
    });
  }, [coverage, search, subject, summaries]);

  const learner = MOCK_LEARNERS.find((item) => item.id === learnerId);
  const learnerSessions = useMemo(
    () => MOCK_SESSIONS.filter((session) => session.learnerId === learnerId),
    [learnerId],
  );
  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return materials.filter((material) => {
      if (material.learnerId !== learnerId) return false;
      const session = MOCK_SESSIONS.find((item) => item.id === material.sessionId);
      const matchesSearch = `${material.title} ${session?.subject ?? ""}`
        .toLocaleLowerCase("vi")
        .includes(query);
      const matchesSubject = subject === "all" || session?.subject === subject;
      const matchesSource = source === "all" || material.source === source;
      const matchesStatus = status === "all" || material.status === status;
      return matchesSearch && matchesSubject && matchesSource && matchesStatus;
    });
  }, [learnerId, materials, search, source, status, subject]);

  function updateMaterial(id: string, changes: Partial<Pick<TutorMaterial, "title" | "status">>) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === id
          ? { ...material, ...changes, updatedAt: new Date().toISOString() }
          : material,
      ),
    );
  }

  function setMaterialStatus(id: string, nextStatus: LibraryMaterialStatus) {
    updateMaterial(id, { status: nextStatus });
  }

  function uploadMaterial(
    targetLearnerId: string,
    sessionId: string,
    file: File,
    title: string,
    saveAsDraft: boolean,
  ) {
    const next: TutorMaterial = {
      id: `material-${Date.now()}`,
      learnerId: targetLearnerId,
      sessionId,
      title,
      source: "upload",
      status: saveAsDraft ? "draft" : "published",
      fileType: getMaterialFileType(file),
      fileSize: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB`,
      updatedAt: new Date().toISOString(),
    };
    setMaterials((current) => [next, ...current]);
  }

  return {
    learners: MOCK_LEARNERS,
    learner,
    learnerSessions,
    materials,
    summaries,
    filteredLearners,
    filteredMaterials,
    subjects,
    search,
    subject,
    coverage,
    source,
    status,
    setSearch,
    setSubject,
    setCoverage,
    setSource,
    setStatus,
    updateMaterial,
    setMaterialStatus,
    uploadMaterial,
  };
}
