import { z } from "zod";
import {
  getLmsResource,
  classPath,
  nullableList,
} from "@workspace/core/lms-classes/api-response";
import {
  sessionPageSchema,
  sessionSchema,
  plannedSchema,
  guid,
} from "@workspace/core/lms-classes/schemas";
import {
  lmsClassPageSchema,
  lmsClassSchema,
} from "../../tutor-classes/schemas/lms-class.schema";

// Shared BE DTO, but separate Learner service: no Tutor mutation or mock fallback.
export const learnerClassFiltersSchema = z.object({
  kind: z.enum(["INDIVIDUAL", "GROUP"]),
  search: z.string().trim().max(100),
  status: z.enum(["all", "ACTIVE", "COMPLETED"]),
  sort: z.enum(["NEWEST", "OLDEST", "STATUS"]),
  page: z.number().int().positive(),
});
export type LearnerClassFilters = z.infer<typeof learnerClassFiltersSchema>;
export type LearnerApiClass = z.infer<typeof lmsClassSchema>;
export const learnerSessionFiltersSchema = z
  .object({
    page: z.number().int().positive(),
    pageSize: z.number().int().min(1).max(100),
    status: z.enum([
      "all",
      "SCHEDULED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
      "RESCHEDULED",
    ]),
    from: z.iso.datetime({ offset: true }).optional(),
    to: z.iso.datetime({ offset: true }).optional(),
  })
  .refine(
    (v) => !v.from || !v.to || Date.parse(v.to) > Date.parse(v.from),
    "Khoảng thời gian không hợp lệ.",
  );
export type LearnerSessionFilters = z.infer<typeof learnerSessionFiltersSchema>;
export const learnerClassesService = {
  list: (input: LearnerClassFilters, signal?: AbortSignal) => {
    const v = learnerClassFiltersSchema.parse(input);
    return getLmsResource("/lms/classes", lmsClassPageSchema, signal, {
      Type: v.kind,
      Search: v.search || undefined,
      Status: v.status === "all" ? undefined : v.status,
      Sort: v.sort,
      Page: v.page,
      PageSize: 6,
    });
  },
  detail: (id: string, signal?: AbortSignal) =>
    getLmsResource(classPath(id), lmsClassSchema, signal),
  sessions: (
    id: string,
    input: LearnerSessionFilters,
    signal?: AbortSignal,
  ) => {
    const v = learnerSessionFiltersSchema.parse(input);
    return getLmsResource(
      `${classPath(id)}/sessions`,
      sessionPageSchema.refine((v) => v.items.every((s) => s.classId === id)),
      signal,
      { ...v, status: v.status === "all" ? undefined : v.status },
    );
  },
  session: (id: string, sessionId: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(id)}/sessions/${guid.parse(sessionId)}`,
      sessionSchema.refine((v) => v.classId === id && v.id === sessionId),
      signal,
    ),
  planned: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(id)}/planned-schedules`,
      nullableList(plannedSchema),
      signal,
    ),
};
