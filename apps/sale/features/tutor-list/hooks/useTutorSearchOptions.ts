import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { vietnamAdministrativeService } from "../../tutor-profile-registration/services/vietnam-administrative.service";
import { learningProgramsService } from "../../tutor-profile-registration/services/learning-programs.service";
import { learningProgramQueryKeys } from "../../tutor-profile-registration/hooks/useLearningProgramOptions";

export function useTutorSearchOptions(
  enabled: boolean,
  programId: string | null,
  contextId: string | null,
  hasContext: boolean | null,
) {
  const refreshedVersionRef = useRef("");
  const programs = useQuery({
    queryKey: learningProgramQueryKeys.programs,
    queryFn: learningProgramsService.listPrograms,
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const contexts = useQuery({
    queryKey: learningProgramQueryKeys.contexts(programId ?? ""),
    queryFn: () => learningProgramsService.listContexts(programId ?? ""),
    enabled: enabled && Boolean(programId),
    staleTime: 0,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.statusCode === 404) && failureCount < 1,
  });

  const programVersionId = contexts.data?.programVersionId ?? "";
  const contextSelection = hasContext === false ? "__none__" : contextId ?? "";
  const teachingItems = useQuery({
    queryKey: learningProgramQueryKeys.teachingItems(
      programId ?? "",
      programVersionId,
      contextSelection,
    ),
    queryFn: () =>
      learningProgramsService.listTeachingItems(
        programId ?? "",
        programVersionId,
        contextSelection,
      ),
    enabled: enabled && Boolean(programId && programVersionId),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.statusCode === 409) && failureCount < 1,
  });

  const refetchContexts = contexts.refetch;
  useEffect(() => {
    if (
      !(teachingItems.error instanceof ApiError) ||
      teachingItems.error.statusCode !== 409 ||
      !programId ||
      !programVersionId
    ) return;
    const versionKey = `${programId}:${programVersionId}`;
    if (refreshedVersionRef.current === versionKey) return;
    refreshedVersionRef.current = versionKey;
    void refetchContexts();
  }, [programId, programVersionId, refetchContexts, teachingItems.error]);

  const provinces = useQuery({
    queryKey: ["vietnam-administrative", "v2", "provinces"],
    queryFn: ({ signal }) => vietnamAdministrativeService.listProvinces(signal),
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return { programs, contexts, teachingItems, provinces };
}
