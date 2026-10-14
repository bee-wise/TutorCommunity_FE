import { z } from "zod";
import {
  classPath,
  getLmsResource,
  postLmsCommand,
  nullableList,
} from "./api-response";
import {
  currentMemberSchema,
  memberSchema,
  memberChangeSchema,
  createMemberChangeSchema,
  reviewMemberChangeSchema,
  versionCommand,
  guid,
} from "./schemas";

export const classMembersService = {
  classes: (page: number, signal?: AbortSignal) =>
    getLmsResource(
      "/lms/classes",
      z.object({
        items: nullableList(
          z.object({
            id: guid,
            tutorId: guid,
            title: z.string().nullish(),
            code: z.string().nullish(),
            status: z.string().nullish(),
            type: z.string().nullish(),
          }),
        ),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
      }),
      signal,
      { Page: page, PageSize: 20, Sort: "NEWEST" },
    ),
  overview: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      classPath(id),
      z.object({
        id: guid,
        tutorId: guid,
        title: z.string().nullish(),
        status: z.string().nullish(),
        type: z.string().nullish(),
      }),
      signal,
    ),
  current: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(id)}/members/current`,
      nullableList(currentMemberSchema),
      signal,
    ),
  history: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(id)}/members`,
      nullableList(memberSchema),
      signal,
    ),
  requests: (id: string, page = 1, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(id)}/member-change-requests`,
      nullableList(memberChangeSchema),
      signal,
      { Page: page, PageSize: 20 },
    ),
  create: (id: string, input: z.infer<typeof createMemberChangeSchema>) =>
    postLmsCommand(
      `${classPath(id)}/member-change-requests`,
      memberChangeSchema,
      createMemberChangeSchema.parse(input),
    ),
  review: (
    id: string,
    requestId: string,
    input: z.infer<typeof reviewMemberChangeSchema>,
  ) =>
    postLmsCommand(
      `${classPath(id)}/member-change-requests/${guid.parse(requestId)}/review`,
      memberChangeSchema,
      reviewMemberChangeSchema.parse(input),
    ),
  cancel: (id: string, requestId: string, version: number) =>
    postLmsCommand(
      `${classPath(id)}/member-change-requests/${guid.parse(requestId)}/cancel`,
      memberChangeSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
};
