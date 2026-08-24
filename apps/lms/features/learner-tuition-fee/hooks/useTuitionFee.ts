"use client";

import { useMemo, useState } from "react";
import {
  LEARNER_TUITION_CLASSES,
  TUITION_SESSIONS,
} from "../data/tuition-fee.mock";
import type {
  TuitionClassStatus,
  TuitionSessionFilter,
} from "../types/tuition-fee.types";
import { buildTuitionSummary } from "../utils/tuition-fee.utils";

export function useTuitionFee() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TuitionClassStatus>("all");
  const summaries = useMemo(
    () => LEARNER_TUITION_CLASSES.map((classInfo) => buildTuitionSummary(classInfo, TUITION_SESSIONS)),
    [],
  );
  const filteredSummaries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return summaries.filter((summary) => {
      const content = `${summary.classInfo.className} ${summary.classInfo.tutorName} ${summary.classInfo.invoiceNumber}`.toLocaleLowerCase("vi");
      return content.includes(query) && (status === "all" || summary.classInfo.status === status);
    });
  }, [search, status, summaries]);

  return { search, status, filteredSummaries, setSearch, setStatus };
}

export function useTuitionClass(classId: string) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TuitionSessionFilter>("all");
  const classInfo = LEARNER_TUITION_CLASSES.find((item) => item.id === classId);
  const summary = useMemo(
    () => classInfo ? buildTuitionSummary(classInfo, TUITION_SESSIONS) : undefined,
    [classInfo],
  );
  const filteredSessions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return TUITION_SESSIONS.filter((session) => {
      const matchesClass = session.classId === classId;
      const matchesSearch = `${session.sequence} ${session.topic}`.toLocaleLowerCase("vi").includes(query);
      const matchesStatus = status === "all" || session.sessionStatus === status;
      return matchesClass && matchesSearch && matchesStatus;
    });
  }, [classId, search, status]);

  return { classInfo, summary, filteredSessions, search, status, setSearch, setStatus };
}
