import { z } from "zod";

const summarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullish(),
  description: z.string().nullish(),
});

export const permissionSchema = z.object({
  id: z.string().uuid(),
  moduleId: z.string().uuid().nullish(),
  moduleName: z.string().nullish(),
  name: z.string().nullish(),
  isCreate: z.boolean(),
  isRead: z.boolean(),
  isUpdate: z.boolean(),
  isDelete: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  assigned: z.boolean(),
});

export const permissionPageSchema = z.object({
  roles: z.array(z.object({
    ...summarySchema.shape,
    permissions: z.array(permissionSchema).nullish(),
  })).nullish(),
  roleOptions: z.array(summarySchema).nullish(),
  modules: z.array(summarySchema).nullish(),
  pagination: z.object({ total: z.number().int(), limit: z.number().int(), offset: z.number().int() }),
});

export const permissionFormSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên quyền."),
  moduleId: z.union([z.literal(""), z.string().uuid()]),
  isCreate: z.boolean(),
  isRead: z.boolean(),
  isUpdate: z.boolean(),
  isDelete: z.boolean(),
});

export type Permission = z.infer<typeof permissionSchema>;
export type PermissionPage = z.infer<typeof permissionPageSchema>;
export type PermissionFormValues = z.infer<typeof permissionFormSchema>;

export type PermissionFilters = {
  roleId?: string;
  moduleId?: string;
  search?: string;
  limit: number;
  offset: number;
};
