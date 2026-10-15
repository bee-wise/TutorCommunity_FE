"use client";

import { useEffect, useState } from "react";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import {
  learnerClassesService as service,
  type LearnerClassFilters,
} from "../services/learner-classes.service";

const directoryId = "00000000-0000-0000-0000-000000000000";
export const defaultLearnerFilters: LearnerClassFilters = {
  kind: "INDIVIDUAL",
  search: "",
  status: "all",
  sort: "NEWEST",
  page: 1,
};
export function useLearnerClassesQuery(initialKind?: string) {
  const [filters, setFilters] = useState<LearnerClassFilters>({
    ...defaultLearnerFilters,
    kind: initialKind === "group" ? "GROUP" : "INDIVIDUAL",
  });
  const [search, setSearch] = useState(filters.search);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setSearch(filters.search.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [filters.search]);
  // A search change resets page synchronously. Wait for its debounce, never send old text on the new page.
  const pendingSearch = search !== filters.search.trim();
  const params = { ...filters, search };
  const query = useLmsClassResource(
    directoryId,
    "learner-directory",
    (s) => service.list(params, s),
    { roles: ["LEARNER"], params: [params], enabled: !pendingSearch },
  );
  const individual = useLmsClassResource(
    directoryId,
    "learner-count",
    (s) => service.list({ ...defaultLearnerFilters, kind: "INDIVIDUAL" }, s),
    { roles: ["LEARNER"], params: ["INDIVIDUAL"] },
  );
  const group = useLmsClassResource(
    directoryId,
    "learner-count",
    (s) => service.list({ ...defaultLearnerFilters, kind: "GROUP" }, s),
    { roles: ["LEARNER"], params: ["GROUP"] },
  );
  return {
    query,
    filters,
    pendingSearch,
    counts: { INDIVIDUAL: individual.data?.total, GROUP: group.data?.total },
    update: (patch: Partial<LearnerClassFilters>) =>
      setFilters((v) => ({ ...v, ...patch, page: patch.page ?? 1 })),
    reset: () =>
      setFilters((v) => ({ ...defaultLearnerFilters, kind: v.kind })),
  };
}
export function useLearnerClassQuery(id: string) {
  return useLmsClassResource(
    id,
    "learner-class",
    (s) => service.detail(id, s),
    { roles: ["LEARNER"] },
  );
}
