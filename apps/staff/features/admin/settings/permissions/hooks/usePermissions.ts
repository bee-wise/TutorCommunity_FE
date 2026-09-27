"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useEffect, useMemo, useState } from "react";
import { permissionsApi } from "../api/permissions.api";
import { permissionQueryKeys } from "../queryKeys";
import type { PermissionFormValues } from "../schemas/permission.schema";

const PAGE_SIZE = 10;

export function usePermissions() {
  const queryClient = useQueryClient();
  const [roleId, setRoleId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [changes, setChanges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const meta = useQuery({
    queryKey: permissionQueryKeys.meta(),
    queryFn: () => permissionsApi.list({ limit: 1, offset: 0 }),
    staleTime: 5 * 60_000,
  });
  const currentRoleId = roleId || meta.data?.roleOptions?.[0]?.id || "";
  const listing = useQuery({
    queryKey: permissionQueryKeys.list(currentRoleId, moduleId, search, page),
    queryFn: () =>
      permissionsApi.list({
        roleId: currentRoleId,
        moduleId: moduleId || undefined,
        search: search || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }),
    enabled: Boolean(currentRoleId),
    staleTime: 15_000,
  });
  const assigned = useQuery({
    queryKey: permissionQueryKeys.assigned(currentRoleId),
    queryFn: () => permissionsApi.assignedIds(currentRoleId),
    enabled: Boolean(currentRoleId),
    staleTime: 15_000,
  });
  const originalIds = useMemo(
    () => new Set(assigned.data ?? []),
    [assigned.data],
  );
  const pendingCount = Object.keys(changes).length;

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: permissionQueryKeys.all });
  };

  const definitionMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id?: string;
      values: PermissionFormValues;
    }) =>
      id ? permissionsApi.update(id, values) : permissionsApi.create(values),
    onSuccess: async (_, variables) => {
      toast.success(variables.id ? "Đã cập nhật quyền" : "Đã tạo quyền mới", {
        position: "top-right",
      });
      await refresh();
    },
    onError: (error) =>
      toast.error("Không thể lưu quyền", {
        description: getApiErrorMessage(error),
      }),
  });
  const deleteMutation = useMutation({
    mutationFn: permissionsApi.remove,
    onSuccess: async (_, deletedId) => {
      toast.success("Đã xóa quyền");
      setChanges((previous) => {
        const next = { ...previous };
        delete next[deletedId];
        return next;
      });
      if (
        page > 0 &&
        (listing.data?.pagination.total ?? 0) <= page * PAGE_SIZE + 1
      ) {
        setPage(page - 1);
      }
      await refresh();
    },
    onError: (error) =>
      toast.error("Không thể xóa quyền", {
        description: getApiErrorMessage(error),
        position: "top-right",
      }),
  });
  const assignmentMutation = useMutation({
    mutationFn: async () => {
      if (!currentRoleId || !assigned.data)
        throw new Error("Chưa tải đủ dữ liệu quyền của vai trò.");
      const next = new Set(assigned.data);
      for (const [id, enabled] of Object.entries(changes)) {
        if (enabled) next.add(id);
        else next.delete(id);
      }
      await permissionsApi.assign(currentRoleId, [...next]);
    },
    onSuccess: async () => {
      await refresh();
      setChanges({});
      toast.success("Đã lưu phân quyền cho vai trò", {
        position: "top-right",
      });
    },
    onError: (error) =>
      toast.error("Không thể lưu phân quyền", {
        description: getApiErrorMessage(error),
        position: "top-right",
      }),
  });

  const setAssignment = (id: string, enabled: boolean) => {
    setChanges((previous) => {
      const next = { ...previous };
      if (enabled === originalIds.has(id)) delete next[id];
      else next[id] = enabled;
      return next;
    });
  };
  const changeRole = (nextRoleId: string) => {
    if (
      pendingCount &&
      !window.confirm("Thay đổi chưa lưu sẽ bị bỏ. Tiếp tục?")
    )
      return;
    setRoleId(nextRoleId);
    setChanges({});
    setPage(0);
  };

  return {
    meta,
    listing,
    assigned,
    currentRoleId,
    originalIds,
    changes,
    pendingCount,
    moduleId,
    searchInput,
    page,
    pageSize: PAGE_SIZE,
    setModuleId: (id: string) => {
      setModuleId(id);
      setPage(0);
    },
    setSearchInput,
    setPage,
    changeRole,
    setAssignment,
    discardChanges: () => setChanges({}),
    saveAssignments: () => assignmentMutation.mutate(),
    savingAssignments: assignmentMutation.isPending,
    saveDefinition: (values: PermissionFormValues, id?: string) =>
      definitionMutation.mutateAsync({ id, values }),
    savingDefinition: definitionMutation.isPending,
    deleteDefinition: (id: string) => deleteMutation.mutateAsync(id),
    deletingDefinition: deleteMutation.isPending,
    reload: refresh,
  };
}
