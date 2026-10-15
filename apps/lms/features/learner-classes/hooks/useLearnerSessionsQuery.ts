"use client";
import { useState } from "react";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import {
  learnerClassesService as service,
  type LearnerSessionFilters,
} from "../services/learner-classes.service";
import {
  monthRange,
  nextMonth,
  vietnamDate,
} from "../utils/learner-api-calendar";
import { useLearnerClassQuery } from "./useLearnerClassesQuery";

export function useLearnerSessionsQuery(classId: string) {
  const overview = useLearnerClassQuery(classId);
  const [view, setView] = useState<"list" | "calendar" | "planned">("list");
  const [status, setStatus] = useState<LearnerSessionFilters["status"]>("all");
  const [month, setMonth] = useState(() =>
    vietnamDate(new Date().toISOString()).slice(0, 7),
  );
  const [page, setPage] = useState(1);
  const range = monthRange(month);
  const params = {
    page,
    pageSize: view === "calendar" ? 100 : 6,
    status,
    ...range,
  };
  const actual = useLmsClassResource(
    classId,
    "learner-sessions",
    (s) => service.sessions(classId, params, s),
    {
      roles: ["LEARNER"],
      params: [params],
      enabled: Boolean(overview.data) && view !== "planned",
    },
  );
  const planned = useLmsClassResource(
    classId,
    "learner-planned",
    (s) => service.planned(classId, s),
    {
      roles: ["LEARNER"],
      enabled: Boolean(overview.data) && view === "planned",
    },
  );
  return {
    overview,
    actual,
    planned,
    view,
    status,
    month,
    page,
    changeView: (v: typeof view) => {
      setView(v);
      setPage(1);
    },
    changeStatus: (v: typeof status) => {
      setStatus(v);
      setPage(1);
    },
    changeMonth: (offset: number) => {
      setMonth((v) => nextMonth(v, offset));
      setPage(1);
    },
    setPage,
  };
}
