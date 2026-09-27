import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import {
  permissionFormSchema,
  permissionPageSchema,
  type PermissionFilters,
  type PermissionFormValues,
  type PermissionPage,
} from "../schemas/permission.schema";

function unwrap<T extends z.ZodType>(value: unknown, schema: T): z.infer<T> {
  const response = z
    .object({
      success: z.boolean(),
      message: z.string().nullish(),
      data: z.unknown(),
    })
    .parse(value);
  if (!response.success)
    throw new Error(response.message || "Yêu cầu không thành công.");
  return schema.parse(response.data);
}

const permissionDetailSchema = z.object({ id: z.string().uuid() });
const assignmentSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()).nullish(),
});

export const permissionsApi = {
  async list(filters: PermissionFilters): Promise<PermissionPage> {
    const response: unknown = await apiClient.get("/admin/permissions", {
      params: {
        RoleId: filters.roleId,
        ModuleId: filters.moduleId,
        Search: filters.search,
        Limit: filters.limit,
        Offset: filters.offset,
      },
    });
    return unwrap(response, permissionPageSchema);
  },

  async create(values: PermissionFormValues): Promise<void> {
    const request = permissionFormSchema.parse(values);
    const response: unknown = await apiClient.post("/admin/permissions", {
      ...request,
      moduleId: request.moduleId || null,
    });
    unwrap(response, permissionDetailSchema);
  },

  async update(id: string, values: PermissionFormValues): Promise<void> {
    const request = permissionFormSchema.parse(values);
    const response: unknown = await apiClient.put(
      `/admin/permissions/${encodeURIComponent(id)}`,
      {
        ...request,
        moduleId: request.moduleId || null,
      },
    );
    unwrap(response, permissionDetailSchema);
  },

  async remove(id: string): Promise<void> {
    const response: unknown = await apiClient.delete(
      `/admin/permissions/${encodeURIComponent(id)}`,
    );
    unwrap(response, z.string().nullish());
  },

  async assign(roleId: string, permissionIds: string[]): Promise<void> {
    const response: unknown = await apiClient.put(
      `/admin/permissions/roles/${encodeURIComponent(roleId)}`,
      { permissionIds },
    );
    unwrap(response, assignmentSchema);
  },

  // The assignment endpoint replaces the complete set. Read every page before editing
  // so saving a filtered or paginated view cannot revoke hidden permissions.
  async assignedIds(roleId: string): Promise<string[]> {
    const pageSize = 100;
    const ids = new Set<string>();
    let offset = 0;
    let total = 0;
    do {
      const page = await this.list({ roleId, limit: pageSize, offset });
      for (const permission of page.roles?.find((role) => role.id === roleId)
        ?.permissions ?? []) {
        if (permission.assigned) ids.add(permission.id);
      }
      total = page.pagination.total;
      offset += page.pagination.limit || pageSize;
    } while (offset < total);
    return [...ids];
  },
};
