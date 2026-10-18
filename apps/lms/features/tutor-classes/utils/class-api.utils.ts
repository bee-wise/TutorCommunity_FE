import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import type { LmsClassDto, LmsClassQuery } from "../schemas/lms-class.schema";
import type { ClassFilters, ClassStatus, TutorClass, TutorClassCardModel } from "../types/classes.types";

const STATUS_MAP: Record<string, ClassStatus> = {
  ACTIVE: "active", UPCOMING: "upcoming", COMPLETED: "completed",
  PENDING_PAYMENT: "pending_payment", CANCELLED: "cancelled",
};
const SORT_MAP = { newest: "NEWEST", oldest: "OLDEST", status: "STATUS" } as const;
const FILTER_STATUS_MAP = { active: "ACTIVE", upcoming: "UPCOMING", completed: "COMPLETED", pending_payment: "PENDING_PAYMENT", cancelled: "CANCELLED" } as const;

export function toClassQuery(filters: ClassFilters, page: number, pageSize = 6): LmsClassQuery {
  return {
    type: filters.kind === "group" ? "GROUP" : "INDIVIDUAL",
    search: filters.search.trim() || undefined,
    status: filters.status === "all" ? undefined : FILTER_STATUS_MAP[filters.status],
    sort: SORT_MAP[filters.sort], page, pageSize,
  };
}

export function toTutorClass(dto: LmsClassDto): TutorClass {
  return {
    id: dto.id, code: dto.code?.trim() || "Chưa có mã lớp",
    title: dto.title?.trim() || dto.teachingItemName?.trim() || "Lớp học chưa có tên",
    subject: dto.teachingItemName?.trim() || "Chưa có nội dung giảng dạy",
    level: dto.contextName?.trim() || "Chưa có bối cảnh học",
    kind: dto.type === "GROUP" ? "group" : dto.type === "INDIVIDUAL" ? "individual" : "unknown",
    status: STATUS_MAP[dto.status ?? ""] ?? "unknown", createdAt: dto.createdAt,
    learnerIds: [], serverDetails: dto,
  };
}

export function toTutorClassCard(dto: LmsClassDto): TutorClassCardModel {
  return { classInfo: toTutorClass(dto), learners: [], learnerPreviews: dto.learners ?? [], learnerCount: dto.learnerCount, sessionCount: dto.sessionCount };
}

export function shouldRetryClassQuery(failures: number, error: unknown) {
  return failures < 1 && ![400, 401, 403, 404, 502].includes(handleApiError(error).statusCode);
}
