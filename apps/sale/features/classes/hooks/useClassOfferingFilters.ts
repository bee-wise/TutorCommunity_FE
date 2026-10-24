"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { learningProgramQueryKeys } from "../../tutor-profile-registration/hooks/useLearningProgramOptions";
import { learningProgramsService } from "../../tutor-profile-registration/services/learning-programs.service";
import { nameKey } from "../utils/classes.utils";

const NO_CONTEXT = "__none__";
const STALE_TIME = 5 * 60 * 1000;

export type OfferingOption = { value: string; label: string };

// Program > context (grade) > teaching item filters, fed by /learning-programs like the 1:1 tutor
// search. Group classes only carry names, so a class matches the selection by its names.
export function useClassOfferingFilters(classes: readonly GroupDto[]) {
  const [programId, setProgramId] = useState("");
  const [contextSelection, setContextSelection] = useState("");
  const [teachingItemId, setTeachingItemId] = useState("");
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
  const programVersionId = contexts.data?.programVersionId ?? "";
  const teachingItems = useQuery({
    queryKey: learningProgramQueryKeys.teachingItems(programId, programVersionId, contextSelection),
    queryFn: () =>
      learningProgramsService.listTeachingItems(programId, programVersionId, contextSelection),
    enabled: Boolean(programId && programVersionId),
    staleTime: STALE_TIME,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.statusCode === 409) && failureCount < 1,
  });

  // A 409 means the program version moved on: reload the contexts (new version) once.
  const refetchContexts = contexts.refetch;
  useEffect(() => {
    if (
      !(teachingItems.error instanceof ApiError) ||
      teachingItems.error.statusCode !== 409 ||
      !programId ||
      !programVersionId
    )
      return;
    const versionKey = `${programId}:${programVersionId}`;
    if (refreshedVersionRef.current === versionKey) return;
    refreshedVersionRef.current = versionKey;
    void refetchContexts();
  }, [programId, programVersionId, refetchContexts, teachingItems.error]);

  const contextList = contexts.data?.contexts;
  const contextIsValid =
    !contextSelection ||
    (contextList !== undefined &&
      (contextSelection === NO_CONTEXT
        ? contexts.data?.hasWithoutContext === true
        : contextList.some((context) => context.id === contextSelection)));
  const context = contextIsValid ? contextSelection : "";

  const itemCatalog = Array.from(
    new Map(
      (teachingItems.data ?? []).map((item) => [item.teachingItemId ?? item.id, item]),
    ).values(),
  );
  const itemIsValid =
    !teachingItemId || itemCatalog.some((item) => (item.teachingItemId ?? item.id) === teachingItemId);
  const item = itemIsValid ? teachingItemId : "";

  const program = programs.data?.find((entry) => entry.id === programId);
  const selectedContext = contextList?.find((entry) => entry.id === context);
  const selectedItem = itemCatalog.find((entry) => (entry.teachingItemId ?? entry.id) === item);

  const programOptions: OfferingOption[] = programs.data
    ? [
        { value: "", label: `Tất cả (${classes.length})` },
        ...programs.data.map((entry) => ({
          value: entry.id,
          label: `${entry.name ?? entry.code ?? "Chương trình chưa đặt tên"} (${
            classes.filter((c) => nameKey(c.programName) === nameKey(entry.name)).length
          })`,
        })),
      ]
    : [];

  const contextOptions: OfferingOption[] = contexts.data
    ? [
        { value: "", label: "Tất cả" },
        ...contexts.data.contexts.map((entry) => ({
          value: entry.id,
          label: entry.name ?? entry.code ?? "Ngữ cảnh chưa đặt tên",
        })),
        ...(contexts.data.hasWithoutContext
          ? [{ value: NO_CONTEXT, label: "Không áp dụng ngữ cảnh" }]
          : []),
      ]
    : [];
  const itemOptions: OfferingOption[] = teachingItems.data
    ? [
        { value: "", label: "Tất cả" },
        ...itemCatalog.map((entry) => ({
          value: entry.teachingItemId ?? entry.id,
          label: entry.name ?? entry.code ?? "Môn chưa đặt tên",
        })),
      ]
    : [];

  const failed = [
    programs.isError && "chương trình",
    contexts.isError && "cấp học / ngữ cảnh",
    teachingItems.isError && "môn / nội dung dạy",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    programId,
    context,
    item,
    activeCount: [programId, context, item].filter(Boolean).length,
    programOptions,
    programLoading: programs.isPending,
    selectProgram(value: string) {
      setProgramId(value);
      setContextSelection("");
      setTeachingItemId("");
    },
    selectContext(value: string) {
      setContextSelection(value);
      setTeachingItemId("");
    },
    selectItem: setTeachingItemId,
    reset() {
      setProgramId("");
      setContextSelection("");
      setTeachingItemId("");
    },
    contextOptions,
    itemOptions,
    programSelected: Boolean(programId),
    contextLoading: contexts.isPending && Boolean(programId),
    itemLoading: teachingItems.isPending && Boolean(programId && programVersionId),
    failed,
    retry() {
      if (programs.isError) void programs.refetch();
      if (contexts.isError) void contexts.refetch();
      if (teachingItems.isError) void teachingItems.refetch();
    },
    matches(classItem: GroupDto) {
      if (program && nameKey(classItem.programName) !== nameKey(program.name)) return false;
      if (context === NO_CONTEXT) {
        if (classItem.contextName?.trim()) return false;
      } else if (selectedContext && nameKey(classItem.contextName) !== nameKey(selectedContext.name)) {
        return false;
      }
      if (selectedItem && nameKey(classItem.teachingItemName) !== nameKey(selectedItem.name)) return false;
      return true;
    },
  };
}
