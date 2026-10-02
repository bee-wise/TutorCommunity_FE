import { z } from "zod";
import type { QueryClient } from "@tanstack/react-query";

const tutorIdentitySchema = z.object({ profileId: z.string(), userId: z.uuid() });

function extractItems(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if ("items" in value && Array.isArray(value.items)) return value.items;
  if ("data" in value) return extractItems(value.data);
  return [];
}

/** Search results provide userId even while the public tutor detail response does not. */
export function resolveTutorUserIdFromCache(queryClient: QueryClient, profileId: string): string | undefined {
  const keys = [["tutors-manual"], ["search-tutor-ai"], ["favorite-tutors", "list"]] as const;
  for (const queryKey of keys) {
    for (const [, data] of queryClient.getQueriesData({ queryKey })) {
      for (const rawItem of extractItems(data)) {
        const item = tutorIdentitySchema.safeParse(rawItem);
        if (item.success && item.data.profileId === profileId) return item.data.userId;
      }
    }
  }
  return undefined;
}
