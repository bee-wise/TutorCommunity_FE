"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { learningProgramsApi } from "../api/learning-programs.api";
import { learningProgramQueryKeys } from "../queryKeys";
import { bulkMappingFormSchema } from "../schemas/learning-program.schema";
import type {
  BulkMappingFormValues,
  ContextFormValues,
  LearningCatalogItem,
  MappingFormValues,
  ProgramFormValues,
  ProgramTypeFormValues,
  TeachingItemFormValues,
  VersionFormValues,
} from "../schemas/learning-program.schema";

export type BulkMappingResult = {
  created: number;
  skipped: number;
  failedMappings: MappingFormValues[];
};

export type LearningAdminAction =
  | { kind: "createProgramType"; values: ProgramTypeFormValues }
  | {
      kind: "updateProgramType";
      item: LearningCatalogItem;
      values: ProgramTypeFormValues;
    }
  | { kind: "deactivateProgramType"; id: string }
  | { kind: "activateProgramType"; item: LearningCatalogItem }
  | { kind: "createProgram"; values: ProgramFormValues }
  | { kind: "updateProgram"; id: string; values: ProgramFormValues }
  | { kind: "deactivateProgram"; id: string }
  | { kind: "activateProgram"; item: LearningCatalogItem }
  | { kind: "createTeachingItem"; values: TeachingItemFormValues }
  | { kind: "updateTeachingItem"; id: string; values: TeachingItemFormValues }
  | { kind: "deactivateTeachingItem"; id: string }
  | { kind: "activateTeachingItem"; item: LearningCatalogItem }
  | { kind: "createVersion"; values: VersionFormValues }
  | { kind: "updateVersion"; id: string; values: VersionFormValues }
  | { kind: "deleteVersion"; id: string }
  | { kind: "cloneVersion"; id: string; values: VersionFormValues }
  | { kind: "publishVersion"; id: string }
  | { kind: "createContext"; values: ContextFormValues }
  | { kind: "updateContext"; id: string; values: ContextFormValues }
  | { kind: "deleteContext"; id: string }
  | { kind: "createMapping"; values: MappingFormValues }
  | { kind: "updateMapping"; id: string; values: MappingFormValues }
  | { kind: "deleteMapping"; id: string };

const actionMessages: Record<LearningAdminAction["kind"], string> = {
  createProgramType: "Đã tạo loại chương trình",
  updateProgramType: "Đã cập nhật loại chương trình",
  deactivateProgramType: "Đã ngừng hoạt động loại chương trình",
  activateProgramType: "Đã kích hoạt loại chương trình",
  createProgram: "Đã tạo chương trình",
  updateProgram: "Đã cập nhật chương trình",
  deactivateProgram: "Đã ngừng hoạt động chương trình",
  activateProgram: "Đã kích hoạt chương trình",
  createTeachingItem: "Đã tạo nội dung dạy",
  updateTeachingItem: "Đã cập nhật nội dung dạy",
  deactivateTeachingItem: "Đã ngừng hoạt động nội dung dạy",
  activateTeachingItem: "Đã kích hoạt nội dung dạy",
  createVersion: "Đã tạo phiên bản nháp",
  updateVersion: "Đã cập nhật phiên bản",
  deleteVersion: "Đã xóa phiên bản nháp",
  cloneVersion: "Đã tạo bản nháp từ phiên bản cũ",
  publishVersion: "Đã xuất bản phiên bản",
  createContext: "Đã thêm cấp học",
  updateContext: "Đã cập nhật cấp học",
  deleteContext: "Đã xóa cấp học",
  createMapping: "Đã thêm tổ hợp giảng dạy",
  updateMapping: "Đã cập nhật tổ hợp giảng dạy",
  deleteMapping: "Đã xóa tổ hợp giảng dạy",
};

export function useLearningProgramsAdmin() {
  const queryClient = useQueryClient();
  const [programId, setProgramId] = useState("");
  const [versionId, setVersionId] = useState("");
  const [mappingBatchProgress, setMappingBatchProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const programTypes = useQuery({
    queryKey: learningProgramQueryKeys.programTypes(),
    queryFn: learningProgramsApi.listProgramTypes,
    staleTime: 30_000,
  });
  const activeProgramTypes = useQuery({
    queryKey: learningProgramQueryKeys.activeProgramTypes(),
    queryFn: learningProgramsApi.listActiveProgramTypes,
    staleTime: 30_000,
  });
  const programs = useQuery({
    queryKey: learningProgramQueryKeys.programs(),
    queryFn: learningProgramsApi.listPrograms,
    staleTime: 30_000,
  });
  const teachingItems = useQuery({
    queryKey: learningProgramQueryKeys.teachingItems(),
    queryFn: learningProgramsApi.listTeachingItems,
    staleTime: 30_000,
  });
  const currentProgramId =
    programId && programs.data?.some((item) => item.id === programId)
      ? programId
      : (programs.data?.[0]?.id ?? "");
  const versions = useQuery({
    queryKey: learningProgramQueryKeys.versions(currentProgramId),
    queryFn: () => learningProgramsApi.listVersions(currentProgramId),
    enabled: Boolean(currentProgramId),
  });
  const currentVersionId =
    versionId && versions.data?.some((item) => item.id === versionId)
      ? versionId
      : (versions.data?.find((item) => item.status?.toUpperCase() === "DRAFT")
          ?.id ??
        versions.data?.find((item) => item.status?.toUpperCase() === "ACTIVE")
          ?.id ??
        versions.data?.[0]?.id ??
        "");
  const contexts = useQuery({
    queryKey: learningProgramQueryKeys.resources(currentVersionId, "contexts"),
    queryFn: () =>
      learningProgramsApi.listResources(currentVersionId, "contexts"),
    enabled: Boolean(currentVersionId),
  });
  const mappings = useQuery({
    queryKey: learningProgramQueryKeys.resources(currentVersionId, "mappings"),
    queryFn: () =>
      learningProgramsApi.listResources(currentVersionId, "mappings"),
    enabled: Boolean(currentVersionId),
  });

  const action = useMutation({
    mutationFn: async (
      input: LearningAdminAction,
    ): Promise<LearningCatalogItem | void> => {
      switch (input.kind) {
        case "createProgramType":
          return learningProgramsApi.createProgramType(input.values);
        case "updateProgramType":
          return learningProgramsApi.updateProgramType(
            input.item.id,
            input.values,
            input.item.status ?? "ACTIVE",
          );
        case "deactivateProgramType":
          return learningProgramsApi.deactivateProgramType(input.id);
        case "activateProgramType":
          return learningProgramsApi.updateProgramType(
            input.item.id,
            {
              code: input.item.code ?? "",
              name: input.item.name ?? "",
            },
            "ACTIVE",
          );
        case "createProgram":
          return learningProgramsApi.createProgram(input.values);
        case "updateProgram":
          return learningProgramsApi.updateProgram(input.id, input.values);
        case "deactivateProgram":
          return learningProgramsApi.deactivateRoot(
            "learning-programs",
            input.id,
          );
        case "activateProgram":
          return learningProgramsApi.activateRoot(
            "learning-programs",
            input.item,
          );
        case "createTeachingItem":
          return learningProgramsApi.createTeachingItem(input.values);
        case "updateTeachingItem":
          return learningProgramsApi.updateTeachingItem(input.id, input.values);
        case "deactivateTeachingItem":
          return learningProgramsApi.deactivateRoot("teaching-items", input.id);
        case "activateTeachingItem":
          return learningProgramsApi.activateRoot("teaching-items", input.item);
        case "createVersion":
          return learningProgramsApi.createVersion(
            currentProgramId,
            input.values,
          );
        case "updateVersion":
          return learningProgramsApi.updateVersion(
            currentProgramId,
            input.id,
            input.values,
          );
        case "deleteVersion":
          return learningProgramsApi.deleteVersion(currentProgramId, input.id);
        case "cloneVersion":
          return learningProgramsApi.cloneVersion(input.id, input.values);
        case "publishVersion":
          return learningProgramsApi.publishVersion(input.id);
        case "createContext":
          return learningProgramsApi.createContext(
            currentVersionId,
            input.values,
          );
        case "updateContext":
          return learningProgramsApi.updateContext(
            currentVersionId,
            input.id,
            input.values,
          );
        case "deleteContext":
          return learningProgramsApi.deleteResource(
            currentVersionId,
            "contexts",
            input.id,
          );
        case "createMapping":
          return learningProgramsApi.createMapping(
            currentVersionId,
            input.values,
          );
        case "updateMapping":
          return learningProgramsApi.updateMapping(
            currentVersionId,
            input.id,
            input.values,
          );
        case "deleteMapping":
          return learningProgramsApi.deleteResource(
            currentVersionId,
            "mappings",
            input.id,
          );
      }
    },
    onSuccess: async (result, input) => {
      if (
        result &&
        (input.kind === "createProgram" || input.kind === "updateProgram")
      )
        setProgramId(result.id);
      if (
        result &&
        (input.kind === "createVersion" ||
          input.kind === "cloneVersion" ||
          input.kind === "updateVersion")
      )
        setVersionId(result.id);
      if (input.kind === "deleteVersion") setVersionId("");
      await queryClient.invalidateQueries({
        queryKey: learningProgramQueryKeys.all,
      });
      toast.success(actionMessages[input.kind], { position: "top-right" });
    },
    onError: (error) =>
      toast.error("Không thể lưu cấu hình", {
        description: getApiErrorMessage(error),
        position: "top-right",
      }),
  });

  const bulkMappings = useMutation({
    mutationFn: async (
      values: BulkMappingFormValues,
    ): Promise<BulkMappingResult & { firstError?: unknown }> => {
      const parsed = bulkMappingFormSchema.parse(values);
      if (!currentVersionId || !mappings.isSuccess) {
        throw new Error(
          "Chưa tải xong tổ hợp của phiên bản. Vui lòng thử lại.",
        );
      }

      const pairKey = (item: MappingFormValues) =>
        `${item.teachingItemId}:${item.contextId}`;
      const requested = [
        ...new Map(
          parsed.mappings.map((item) => [pairKey(item), item]),
        ).values(),
      ];
      const existing = new Set(
        (mappings.data ?? []).map(
          (item) => `${item.teachingItemId}:${item.contextId ?? "__none__"}`,
        ),
      );
      const pending = requested.filter((item) => !existing.has(pairKey(item)));
      const failed = new Set<string>();
      let firstError: unknown;
      let created = 0;
      let done = 0;
      let nextIndex = 0;
      setMappingBatchProgress({ done: 0, total: pending.length });

      const worker = async () => {
        while (nextIndex < pending.length) {
          const mapping = pending[nextIndex++];
          if (!mapping) continue;
          try {
            await learningProgramsApi.createMapping(currentVersionId, mapping);
            created += 1;
          } catch (error) {
            failed.add(pairKey(mapping));
            firstError ??= error;
          } finally {
            done += 1;
            setMappingBatchProgress({ done, total: pending.length });
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(3, pending.length) }, worker),
      );
      return {
        created,
        skipped: requested.length - pending.length,
        failedMappings: pending.filter((item) => failed.has(pairKey(item))),
        firstError,
      };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: learningProgramQueryKeys.resources(
          currentVersionId,
          "mappings",
        ),
      });
      if (result.created) {
        toast.success(`Đã thêm ${result.created} tổ hợp giảng dạy`, {
          position: "top-right",
        });
      }
      if (result.failedMappings.length) {
        toast.error(`Chưa thêm được ${result.failedMappings.length} tổ hợp`, {
          description: getApiErrorMessage(result.firstError),
          position: "top-right",
        });
      } else if (!result.created) {
        toast.success("Các tổ hợp đã được liên kết trước đó", {
          position: "top-right",
        });
      }
    },
    onError: (error) =>
      toast.error("Không thể thêm tổ hợp", {
        description: getApiErrorMessage(error),
        position: "top-right",
      }),
    onSettled: () => setMappingBatchProgress(null),
  });

  return {
    programTypes,
    activeProgramTypes,
    programs,
    teachingItems,
    versions,
    contexts,
    mappings,
    currentProgramId,
    currentVersionId,
    currentProgram: programs.data?.find((item) => item.id === currentProgramId),
    currentVersion: versions.data?.find((item) => item.id === currentVersionId),
    chooseProgram: (id: string) => {
      setProgramId(id);
      setVersionId("");
    },
    chooseVersion: setVersionId,
    reload: () =>
      queryClient.invalidateQueries({ queryKey: learningProgramQueryKeys.all }),
    runAction: action.mutateAsync,
    runCreateMappings: bulkMappings.mutateAsync,
    mappingBatchProgress,
    isSaving: action.isPending || bulkMappings.isPending,
  };
}
