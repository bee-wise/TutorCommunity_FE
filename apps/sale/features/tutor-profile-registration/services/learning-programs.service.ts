import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";

const learningCatalogItemSchema = z
  .object({
    id: z.string().uuid(),
    code: z.string().nullish(),
    name: z.string().nullish(),
    type: z.string().nullish(),
    status: z.string().nullish(),
    programId: z.string().uuid().nullish(),
    programVersionId: z.string().uuid().nullish(),
    teachingItemId: z.string().uuid().nullish(),
    contextId: z.string().uuid().nullish(),
  })
  .passthrough();

const learningCatalogResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(learningCatalogItemSchema).nullish(),
});

const learningProgramContextsResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      programVersionId: z.string().uuid(),
      hasWithoutContext: z.boolean(),
      contexts: z.array(learningCatalogItemSchema),
    })
    .nullish(),
});

export type LearningCatalogItem = z.infer<typeof learningCatalogItemSchema>;
export type LearningProgramContexts = NonNullable<
  z.infer<typeof learningProgramContextsResponseSchema>["data"]
>;

async function getCatalog(path: string): Promise<LearningCatalogItem[]> {
  const response = await apiClient.get<never, unknown>(path);
  return learningCatalogResponseSchema.parse(response).data ?? [];
}

export const learningProgramsService = {
  listPrograms: () => getCatalog("/learning-programs"),
  async listContexts(programId: string): Promise<LearningProgramContexts | null> {
    const response = await apiClient.get<never, unknown>(
      `/learning-programs/${programId}/contexts`,
    );
    return learningProgramContextsResponseSchema.parse(response).data ?? null;
  },
  async listTeachingItems(
    programId: string,
    programVersionId: string,
    contextSelection: string,
  ): Promise<LearningCatalogItem[]> {
    const hasContext =
      contextSelection !== "__none__" && contextSelection !== "__proposal__";
    const path = hasContext
      ? `/learning-programs/${programId}/contexts/${contextSelection}/teaching-items`
      : `/learning-programs/${programId}/teaching-items`;
    const response = await apiClient.get<never, unknown>(path, {
      params: {
        programVersionId,
        ...(contextSelection === "__none__" ? { withoutContext: true } : {}),
      },
    });
    return learningCatalogResponseSchema.parse(response).data ?? [];
  },
};
