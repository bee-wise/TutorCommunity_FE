import { z } from "zod";

const favoriteTutorIdValueSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value));

const favoriteTutorIdItemSchema = z.union([
  favoriteTutorIdValueSchema,
  z
    .object({
      tutorProfileId: favoriteTutorIdValueSchema.optional(),
      profileId: favoriteTutorIdValueSchema.optional(),
      id: favoriteTutorIdValueSchema.optional(),
    })
    .transform((value) => value.tutorProfileId ?? value.profileId ?? value.id),
]);

const favoriteTutorIdsArraySchema = z
  .array(favoriteTutorIdItemSchema)
  .transform((items) => [
    ...new Set(items.filter((item): item is string => Boolean(item))),
  ]);

const favoriteTutorIdsPayloadSchema = z
  .union([
    favoriteTutorIdsArraySchema,
    z.object({ ids: favoriteTutorIdsArraySchema }),
    z.object({ tutorProfileIds: favoriteTutorIdsArraySchema }),
    z.object({ favoriteTutorIds: favoriteTutorIdsArraySchema }),
  ])
  .transform((payload) => {
    if (Array.isArray(payload)) return payload;
    if ("ids" in payload) return payload.ids;
    if ("tutorProfileIds" in payload) return payload.tutorProfileIds;
    return payload.favoriteTutorIds;
  });

export function parseFavoriteTutorIds(payload: unknown): string[] {
  const result = favoriteTutorIdsPayloadSchema.safeParse(payload);
  return result.success ? result.data : [];
}
