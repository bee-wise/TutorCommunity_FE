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
  const [view, setView] = useState<"list" | "planned">("list");
  const [status, setStatus] = useState<LearnerSessionFilters["status"]>("all");
  const [month, setMonth] = useState(() =>
    vietnamDate(new Date().toISOString()).slice(0, 7),
  );
  const [customRange, setCustomRange] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [page, setPage] = useState(1);

  const range = customRange ?? monthRange(month);
  const params: LearnerSessionFilters = {
    page,
    pageSize: 6,
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
    customRange,
    isCustom: Boolean(customRange),
    appliedRange: range,
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
      setCustomRange(null);
      setMonth((v) => nextMonth(v, offset));
      setPage(1);
    },
    applyCustomRange: (from: string, to: string) => {
      setCustomRange({ from, to });
      setPage(1);
    },
    resetMonthPreset: () => {
      setCustomRange(null);
      setPage(1);
    },
    setPage,
  };
}
