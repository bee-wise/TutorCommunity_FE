"use client";

import { useState } from "react";
import { normalizeClassSearch } from "../utils/classes.utils";
import { useTutorClassDetail } from "./useTutorClassDetail";

export function useClassMembers(classId: string) {
  const detail = useTutorClassDetail(classId);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const filtered = detail.learners.filter((learner) => normalizeClassSearch(`${learner.fullName} ${learner.email ?? ""} ${learner.gradeLevel}`).includes(normalizeClassSearch(search)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount - 1);
  return { ...detail, search, page: currentPage, pageCount, total: filtered.length,
    members: filtered.slice(currentPage * 12, (currentPage + 1) * 12), setPage,
    updateSearch(value: string) { setSearch(value); setPage(0); },
  };
}
