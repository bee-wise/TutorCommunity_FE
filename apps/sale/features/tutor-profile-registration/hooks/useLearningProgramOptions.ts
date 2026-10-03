"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { learningProgramsService } from "../services/learning-programs.service";

const STALE_TIME = 5 * 60 * 1000;

export const learningProgramQueryKeys = {
  programs: ["learning-programs", "programs"] as const,
  contexts: (programId: string) => ["learning-programs", programId, "contexts"] as const,
  teachingItems: (programId: string, programVersionId: string, contextSelection: string) =>
    ["learning-programs", programId, programVersionId, "teaching-items", contextSelection] as const,
};

export function useLearningProgramOptions(
  programId: string,
  programVersionId: string,
  contextSelection: string,
) {
  const refreshedVersionRef = useRef("");
  const programs = useQuery({
    queryKey: learningProgramQueryKeys.programs,
    queryFn: learningProgramsService.listPrograms,
    staleTime: STALE_TIME,
  });
  const contexts = useQuery({
    queryKey: learningProgramQueryKeys.contexts(programId),
    queryFn: () => learningProgramsService.listContexts(programId),
    enabled: Boolean(programId),
    staleTime: 0,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.statusCode === 404) && failureCount < 1,
  });
  const currentVersionId = contexts.data?.programVersionId ?? "";
  const selectableContext =
    contextSelection === "__proposal__" ||
    (contextSelection === "__none__"
      ? contexts.data?.hasWithoutContext === true
      : contexts.data?.contexts.some((item) => item.id === contextSelection) === true);
  const teachingItems = useQuery({
    queryKey: learningProgramQueryKeys.teachingItems(
      programId,
      currentVersionId,
      contextSelection,
    ),
    queryFn: () =>
      learningProgramsService.listTeachingItems(
        programId,
        currentVersionId,
        contextSelection,
      ),
    enabled:
      Boolean(programId && currentVersionId && contextSelection) &&
      selectableContext &&
      programVersionId === currentVersionId &&
      contexts.isSuccess &&
      !contexts.isFetching,
    staleTime: 0,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.statusCode === 409) && failureCount < 1,
  });

  const refetchContexts = contexts.refetch;
  useEffect(() => {
    if (
      !(teachingItems.error instanceof ApiError) ||
      teachingItems.error.statusCode !== 409 ||
      !programId ||
      !currentVersionId
    ) return;
    const key = `${programId}:${currentVersionId}`;
    if (refreshedVersionRef.current === key) return;
    refreshedVersionRef.current = key;
    void refetchContexts();
  }, [currentVersionId, programId, refetchContexts, teachingItems.error]);

  return { programs, contexts, teachingItems };
}
