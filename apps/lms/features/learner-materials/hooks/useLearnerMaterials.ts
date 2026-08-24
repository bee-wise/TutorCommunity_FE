"use client";

import { useMemo, useState } from "react";
import {
  LEARNER_CLASSES,
  LEARNER_CLASS_SESSIONS,
  LEARNER_SHARED_MATERIALS,
} from "../data/learner-materials.mock";
import type {
  LearnerClassSessionStatus,
  LearnerMaterialFileType,
  LearnerMaterialSource,
  SessionMaterialAvailability,
} from "../types/learner-materials.types";
import { buildClassSummaries } from "../utils/learner-materials.utils";

export function useClassLibrary() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const summaries = useMemo(
    () => buildClassSummaries(LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS),
    [],
  );
  const subjects = useMemo(() => [...new Set(LEARNER_CLASSES.map((item) => item.subject))], []);
  const filteredClasses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return summaries.filter((summary) => {
      const content = `${summary.classInfo.subject} ${summary.classInfo.level} ${summary.classInfo.tutorName}`.toLocaleLowerCase("vi");
      return content.includes(query) && (subject === "all" || summary.classInfo.subject === subject);
    });
  }, [search, subject, summaries]);

  return { summaries, filteredClasses, subjects, search, subject, setSearch, setSubject };
}

export function useClassSessions(classId: string) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | LearnerClassSessionStatus>("all");
  const [availability, setAvailability] = useState<SessionMaterialAvailability>("all");
  const classInfo = LEARNER_CLASSES.find((item) => item.id === classId);
  const classSessions = useMemo(
    () => LEARNER_CLASS_SESSIONS.filter((session) => session.classId === classId),
    [classId],
  );
  const filteredSessions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return classSessions.filter((session) => {
      const materialCount = LEARNER_SHARED_MATERIALS.filter((material) => material.sessionId === session.id).length;
      const matchesSearch = session.topic.toLocaleLowerCase("vi").includes(query);
      const matchesStatus = status === "all" || session.status === status;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && materialCount > 0) ||
        (availability === "empty" && materialCount === 0);
      return matchesSearch && matchesStatus && matchesAvailability;
    });
  }, [availability, classSessions, search, status]);

  return {
    classInfo,
    classSessions,
    filteredSessions,
    materials: LEARNER_SHARED_MATERIALS,
    search,
    status,
    availability,
    setSearch,
    setStatus,
    setAvailability,
  };
}

export function useSessionMaterials(classId: string, sessionId: string) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<"all" | LearnerMaterialSource>("all");
  const [fileType, setFileType] = useState<"all" | LearnerMaterialFileType>("all");
  const classInfo = LEARNER_CLASSES.find((item) => item.id === classId);
  const session = LEARNER_CLASS_SESSIONS.find(
    (item) => item.id === sessionId && item.classId === classId,
  );
  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return LEARNER_SHARED_MATERIALS.filter((material) => {
      const matchesSession = material.sessionId === sessionId;
      const matchesSearch = `${material.title} ${material.description}`
        .toLocaleLowerCase("vi")
        .includes(query);
      const matchesSource = source === "all" || material.source === source;
      const matchesType = fileType === "all" || material.fileType === fileType;
      return matchesSession && matchesSearch && matchesSource && matchesType;
    });
  }, [fileType, search, sessionId, source]);

  return {
    classInfo,
    session,
    filteredMaterials,
    search,
    source,
    fileType,
    setSearch,
    setSource,
    setFileType,
  };
}

