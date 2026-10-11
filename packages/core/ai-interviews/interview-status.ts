import type { InterviewPrompt, InterviewState } from "./schemas/tutor.schema";

export function isAnswerStillProcessing(state: InterviewState, previous: InterviewPrompt): boolean {
  return state.status === "IN_PROGRESS" && !state.all_answered && !state.retry && state.prompt?.q_code === previous.q_code && state.prompt?.kind === previous.kind;
}

export const interviewStatusLabels: Record<string, string> = {
  IN_PROGRESS: "Đang phỏng vấn", INTERRUPTED: "Bị gián đoạn", SYSTEM_ERROR: "Lỗi hệ thống",
  COMPLETED: "Đã nộp, chờ chấm", AI_PROCESSING: "AI đang chấm", PENDING_REVIEW: "Chờ Consultant duyệt",
  APPROVED: "Đã phê duyệt", NEEDS_REVISION: "Cần bổ sung hồ sơ", REJECTED: "Đã từ chối",
  ABANDONED: "Đã kết thúc", SUPERSEDED: "Đã thay bằng buổi mới",
};
export function isOpenInterview(status: string): boolean {
  return ["IN_PROGRESS", "INTERRUPTED", "SYSTEM_ERROR"].includes(status);
}
export function isReviewableInterview(status: string): boolean {
  return ["PENDING_REVIEW", "NEEDS_REVISION"].includes(status);
}
export function canGrantInterviewAttempt(status: string): boolean {
  return ["COMPLETED", "AI_PROCESSING", "PENDING_REVIEW", "APPROVED", "NEEDS_REVISION", "REJECTED", "ABANDONED", "SUPERSEDED"].includes(status);
}
