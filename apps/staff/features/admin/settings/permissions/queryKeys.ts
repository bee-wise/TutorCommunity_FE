export const permissionQueryKeys = {
  all: ["admin", "permissions"] as const,
  meta: () => [...permissionQueryKeys.all, "meta"] as const,
  list: (roleId: string, moduleId: string, search: string, page: number) =>
    [...permissionQueryKeys.all, "list", roleId, moduleId, search, page] as const,
  assigned: (roleId: string) =>
    [...permissionQueryKeys.all, "assigned", roleId] as const,
};
