import { getLmsResource, nullableList } from "../lms-classes/api-response";
import {
  guid,
  lmsScheduleViewSchema,
  lmsSchedulePageViewSchema,
  lmsScheduleKpiViewSchema,
  lmsSessionJoinViewSchema,
  calendarRangeSchema,
  type LmsSchedulePageView,
  type LmsScheduleView,
} from "./schemas";

export interface CalendarQueryParams {
  from: string;
  to: string;
  classId?: string;
  status?: string;
  teachingOfferingId?: string;
  page?: number;
  pageSize?: number;
}

export interface SessionsQueryParams {
  from?: string;
  to?: string;
  sort?: "asc" | "desc";
  classId?: string;
  status?: string;
  teachingOfferingId?: string;
  group?: "NEXT" | "HISTORY";
  page?: number;
  pageSize?: number;
}

export const lmsCalendarService = {
  getCalendarPage: (
    params: CalendarQueryParams,
    signal?: AbortSignal,
  ): Promise<LmsSchedulePageView> => {
    calendarRangeSchema.parse({ from: params.from, to: params.to });
    return getLmsResource(
      "/lms/me/calendar",
      lmsSchedulePageViewSchema,
      signal,
      {
        from: params.from,
        to: params.to,
        classId: params.classId,
        status: params.status && params.status !== "all" ? params.status : undefined,
        teachingOfferingId: params.teachingOfferingId,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 100,
      },
    );
  },

  getAllCalendar: async (
    params: Omit<CalendarQueryParams, "page" | "pageSize">,
    signal?: AbortSignal,
  ): Promise<LmsScheduleView[]> => {
    calendarRangeSchema.parse({ from: params.from, to: params.to });
    const firstPage = await lmsCalendarService.getCalendarPage(
      { ...params, page: 1, pageSize: 100 },
      signal,
    );

    const items = [...firstPage.items];
    const total = firstPage.total;
    const pageSize = firstPage.pageSize;

    if (total > pageSize) {
      const totalPages = Math.ceil(total / pageSize);
      for (let p = 2; p <= totalPages; p++) {
        if (signal?.aborted) break;
        const nextPage = await lmsCalendarService.getCalendarPage(
          { ...params, page: p, pageSize },
          signal,
        );
        items.push(...nextPage.items);
      }
    }

    return items;
  },

  getSessions: (
    params: SessionsQueryParams = {},
    signal?: AbortSignal,
  ): Promise<LmsSchedulePageView> => {
    return getLmsResource(
      "/lms/me/sessions",
      lmsSchedulePageViewSchema,
      signal,
      {
        from: params.from,
        to: params.to,
        sort: params.sort,
        classId: params.classId,
        status: params.status && params.status !== "all" ? params.status : undefined,
        teachingOfferingId: params.teachingOfferingId,
        group: params.group,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
      },
    );
  },

  getUpcoming: (signal?: AbortSignal) =>
    getLmsResource(
      "/lms/me/sessions/upcoming",
      nullableList(lmsScheduleViewSchema),
      signal,
    ),

  getSessionDetail: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `/lms/me/sessions/${guid.parse(id)}`,
      lmsScheduleViewSchema,
      signal,
    ),

  getKpis: (signal?: AbortSignal) =>
    getLmsResource("/lms/me/kpis", lmsScheduleKpiViewSchema, signal),

  joinSession: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `/lms/me/sessions/${guid.parse(id)}/join`,
      lmsSessionJoinViewSchema,
      signal,
    ),
};
