import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import {
  contextFormSchema,
  learningCatalogItemSchema,
  mappingFormSchema,
  programFormSchema,
  programTypeFormSchema,
  teachingItemFormSchema,
  versionFormSchema,
  type ContextFormValues,
  type LearningCatalogItem,
  type MappingFormValues,
  type ProgramFormValues,
  type ProgramTypeFormValues,
  type TeachingItemFormValues,
  type VersionFormValues,
} from "../schemas/learning-program.schema";

const listResponseSchema = z.object({ success: z.literal(true), data: z.array(learningCatalogItemSchema).nullish() });
const itemResponseSchema = z.object({ success: z.literal(true), data: learningCatalogItemSchema });
type Resource = "contexts" | "mappings";
type RootResource = "learning-programs" | "teaching-items";
const segment = (id: string) => encodeURIComponent(id);

async function list(path: string) {
  const response: unknown = await apiClient.get(path);
  return listResponseSchema.parse(response).data ?? [];
}

async function create(path: string, body: Record<string, unknown>) {
  const response: unknown = await apiClient.post(path, body);
  return itemResponseSchema.parse(response).data;
}

async function update(path: string, body: Record<string, unknown>) {
  const response: unknown = await apiClient.put(path, body);
  return itemResponseSchema.parse(response).data;
}

export const learningProgramsApi = {
  listProgramTypes: () => list("/admin/learning-program-types"),
  listActiveProgramTypes: () => list("/learning-program-types"),
  createProgramType: (values: ProgramTypeFormValues) =>
    create("/admin/learning-program-types", {
      ...programTypeFormSchema.parse(values),
      status: "ACTIVE",
    }),
  updateProgramType: (id: string, values: ProgramTypeFormValues, status: string) =>
    update(`/admin/learning-program-types/${segment(id)}`, {
      ...programTypeFormSchema.parse(values),
      status,
    }),
  async deactivateProgramType(id: string) {
    await apiClient.delete(`/admin/learning-program-types/${segment(id)}`);
  },
  listPrograms: () => list("/admin/learning-programs"),
  listTeachingItems: () => list("/admin/teaching-items"),
  createProgram: (values: ProgramFormValues) => create("/admin/learning-programs", programFormSchema.parse(values)),
  updateProgram: (id: string, values: ProgramFormValues) =>
    update(`/admin/learning-programs/${segment(id)}`, programFormSchema.parse(values)),
  createTeachingItem: (values: TeachingItemFormValues) =>
    create("/admin/teaching-items", teachingItemFormSchema.parse(values)),
  updateTeachingItem: (id: string, values: TeachingItemFormValues) =>
    update(`/admin/teaching-items/${segment(id)}`, teachingItemFormSchema.parse(values)),
  async deactivateRoot(resource: RootResource, id: string) {
    await apiClient.delete(`/admin/${resource}/${segment(id)}`);
  },
  activateRoot(resource: RootResource, item: LearningCatalogItem) {
    return update(`/admin/${resource}/${segment(item.id)}`, {
      code: item.code,
      name: item.name,
      ...(resource === "learning-programs" ? { type: item.type } : {}),
      status: "ACTIVE",
    });
  },
  listVersions: (programId: string) => list(`/admin/learning-programs/${segment(programId)}/versions`),
  listResources: (versionId: string, resource: Resource) =>
    list(`/admin/program-versions/${segment(versionId)}/${resource}`),

  createVersion(programId: string, values: VersionFormValues) {
    const parsed = versionFormSchema.parse(values);
    return create(`/admin/learning-programs/${segment(programId)}/versions`, {
      name: parsed.name,
      ...(parsed.effectiveFrom ? { effectiveFrom: parsed.effectiveFrom } : {}),
    });
  },
  updateVersion(programId: string, versionId: string, values: VersionFormValues) {
    const parsed = versionFormSchema.parse(values);
    return update(`/admin/learning-programs/${segment(programId)}/versions/${segment(versionId)}`, {
      name: parsed.name,
      effectiveFrom: parsed.effectiveFrom || null,
    });
  },
  async deleteVersion(programId: string, versionId: string) {
    await apiClient.delete(`/admin/learning-programs/${segment(programId)}/versions/${segment(versionId)}`);
  },
  cloneVersion(versionId: string, values: VersionFormValues) {
    const parsed = versionFormSchema.parse(values);
    return create(`/admin/program-versions/${segment(versionId)}/clone`, {
      name: parsed.name,
      ...(parsed.effectiveFrom ? { effectiveFrom: parsed.effectiveFrom } : {}),
    });
  },
  async publishVersion(versionId: string) {
    const response: unknown = await apiClient.post(`/admin/program-versions/${segment(versionId)}/publish`);
    return itemResponseSchema.parse(response).data;
  },

  createContext(versionId: string, values: ContextFormValues) {
    return create(`/admin/program-versions/${segment(versionId)}/contexts`, contextFormSchema.parse(values));
  },
  updateContext(versionId: string, contextId: string, values: ContextFormValues) {
    return update(`/admin/program-versions/${segment(versionId)}/contexts/${segment(contextId)}`, contextFormSchema.parse(values));
  },
  createMapping(versionId: string, values: MappingFormValues) {
    const parsed = mappingFormSchema.parse(values);
    return create(`/admin/program-versions/${segment(versionId)}/mappings`, {
      teachingItemId: parsed.teachingItemId,
      contextId: parsed.contextId === "__none__" ? null : parsed.contextId,
    });
  },
  updateMapping(versionId: string, mappingId: string, values: MappingFormValues) {
    const parsed = mappingFormSchema.parse(values);
    return update(`/admin/program-versions/${segment(versionId)}/mappings/${segment(mappingId)}`, {
      teachingItemId: parsed.teachingItemId,
      contextId: parsed.contextId === "__none__" ? null : parsed.contextId,
    });
  },
  async deleteResource(versionId: string, resource: Resource, id: string) {
    await apiClient.delete(`/admin/program-versions/${segment(versionId)}/${resource}/${segment(id)}`);
  },
};
