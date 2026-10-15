"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { ApiError, handleApiError } from "../sys-libs/error-handler";
import { guid } from "./schemas";
import { lmsClassKeys } from "./query-keys";

export function useLmsClassActor(roles: readonly string[] = ["TUTOR"]) {
  const user = useAuthStore((s) => s.user);
  const checking = useAuthStore((s) => s.isAuthLoading);
  const role = user?.role?.toUpperCase() ?? "";
  const allowed = !checking && Boolean(user?.id) && roles.includes(role);
  return {
    id: user?.id ?? "",
    role,
    checking,
    allowed,
    error:
      checking || allowed
        ? null
        : new ApiError("Không có quyền truy cập.", user ? 403 : 401),
  };
}
export function useLmsClassResource<T>(
  classId: string,
  resource: string,
  read: (signal: AbortSignal) => Promise<T>,
  options?: {
    enabled?: boolean;
    roles?: readonly string[];
    params?: readonly unknown[];
  },
) {
  const actor = useLmsClassActor(options?.roles);
  const valid = guid.safeParse(classId).success;
  const query = useQuery({
    queryKey: lmsClassKeys.resource(
      actor.id,
      classId,
      resource,
      ...(options?.params ?? []),
    ),
    queryFn: ({ signal }) => read(signal),
    enabled: actor.allowed && valid && options?.enabled !== false,
    staleTime: 15_000,
    retry: (n, error) =>
      n < 1 &&
      ![400, 401, 403, 404, 409, 502].includes(
        handleApiError(error).statusCode,
      ),
  });
  return {
    ...query,
    actor,
    data: actor.allowed && valid && !query.isError ? query.data : undefined,
    error:
      actor.error ??
      (!valid ? new ApiError("Không tìm thấy lớp.", 404) : query.error),
    loading:
      actor.checking ||
      (actor.allowed && valid && options?.enabled !== false && query.isPending),
  };
}
export function useLmsClassCommand<Input, Output>(
  classId: string,
  write: (input: Input) => Promise<Output>,
  roles: readonly string[] = ["TUTOR"],
) {
  const actor = useLmsClassActor(roles);
  const client = useQueryClient();
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: lmsClassKeys.actor(actor.id) }),
      client.invalidateQueries({ queryKey: ["tutor-classes", actor.id] }),
    ]);
  };
  return useMutation({
    retry: false,
    mutationFn: (input: Input) => {
      if (!actor.allowed) throw new ApiError("Không có quyền thực hiện.", 403);
      guid.parse(classId);
      return write(input);
    },
    onSuccess: refresh,
    onError: async (error) => {
      if ([401, 403, 409].includes(handleApiError(error).statusCode))
        await refresh();
    },
  });
}
