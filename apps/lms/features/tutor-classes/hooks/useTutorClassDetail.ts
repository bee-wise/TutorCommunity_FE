"use client";

import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { tutorClassQueryKeys } from "../query-keys";
import { getTutorClassDetail } from "../services/classes.service";
import type { ClassLearner } from "../types/classes.types";
import { shouldRetryClassQuery, toTutorClass } from "../utils/class-api.utils";
import { useTutorClassAccess } from "./useTutorClassAccess";

const EMPTY_ROSTER: ClassLearner[] = [];

export function useTutorClassDetail(classId: string) {
  const access = useTutorClassAccess();
  const validId = z.guid().safeParse(classId).success;
  const query = useQuery({
    queryKey: tutorClassQueryKeys.detail(access.actorId, classId),
    queryFn: ({ signal }) => getTutorClassDetail(classId, signal),
    enabled: access.allowed && validId, staleTime: 30_000, retry: shouldRetryClassQuery,
  });
  const data = access.allowed && validId && !query.isError ? query.data : undefined;
  return {
    classInfo: data ? toTutorClass(data) : undefined,
    // Roster is a separate API, not fabricated from the overview.
    learners: EMPTY_ROSTER,
    loading: access.checking || (access.allowed && validId && query.isPending),
    error: access.error ?? (!validId ? new ApiError("Không tìm thấy lớp học.", 404) : query.error),
    retry() { if (access.allowed && validId) void query.refetch(); },
  };
}
