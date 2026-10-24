import type {
  InterviewPackage,
  InterviewQuestion,
} from "@workspace/core/ai-interviews/schemas/review.schema";

const reasonLabels: Record<string, string> = {
  DATA_CONFLICT: "Thông tin phỏng vấn khác với hồ sơ",
  OVERALL_BELOW_REFERENCE: "Tổng điểm dưới mức tham chiếu",
  CORE_BELOW_MINIMUM: "Tiêu chí cốt lõi dưới mức tối thiểu",
  ASSESSMENT_ERROR: "Có lỗi khi chấm điểm",
  INSUFFICIENT_EVIDENCE: "Chưa đủ minh chứng",
  VERIFICATION_REQUIRED: "Cần xác minh minh chứng",
  SCORE_INCOMPLETE: "Điểm chưa đầy đủ",
};
export function reviewReason(reason: string) {
  const [code, ...references] = reason.split(":");
  return `${reasonLabels[code ?? ""] ?? reason}${references.length && reasonLabels[code ?? ""] ? ` · ${references.join(":")}` : ""}`;
}
export function interviewDate(value: string | null) {
  if (!value) return "Chưa nộp";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("vi-VN");
}
export function assessmentLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    Strong: "Thể hiện tốt",
    "Meets Expectations": "Đáp ứng kỳ vọng",
    "Requires Review": "Cần xem xét thêm",
    "Significant Concerns": "Có vấn đề đáng lưu ý",
  };
  return value ? (labels[value] ?? value) : "Chưa có nhận định";
}
export function tutorDisplayName(tutor: InterviewPackage["tutor"]) {
  for (const key of ["fullName", "full_name", "displayName", "name"]) {
    if (typeof tutor?.[key] === "string" && tutor[key].trim())
      return tutor[key];
  }
  return "Hồ sơ gia sư";
}
export function questionNeedsReview(question: InterviewQuestion) {
  return (
    !!question.turn?.needs_review ||
    question.criteria.some(
      (item) =>
        item.needs_review ||
        item.review_reasons.length ||
        item.effective_score == null,
    )
  );
}

export function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
export function formatScore(value: number | null | undefined, digits = 1) {
  if (value == null) return "—";
  return String(Number(value.toFixed(digits)));
}
export function studentYearLabel(value: unknown) {
  const match = /^YEAR_(\d+)$/.exec(text(value));
  return match ? `Sinh viên năm ${match[1]}` : text(value);
}
export function tutorInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.slice(-2).map((part) => part[0]).join("") || "GS").toUpperCase();
}
const scoreStatusLabels: Record<string, string> = {
  SCORED: "Đã chấm",
  DATA_CONFLICT: "Lệch với hồ sơ",
  INSUFFICIENT_EVIDENCE: "Thiếu minh chứng",
};
export function scoreStatusLabel(value: string | null | undefined) {
  return value ? (scoreStatusLabels[value] ?? value) : "Chưa chấm";
}
const evidenceLabels: Record<string, string> = {
  SELF_REPORTED: "Tự khai, chưa xác minh",
  ANSWER_EVIDENCE: "Trích từ câu trả lời",
};
export function evidenceLabel(value: string) {
  return evidenceLabels[value] ?? value;
}
export function conflictStatusLabel(value: string) {
  return value === "NEEDS_VERIFICATION" || value === "OPEN"
    ? "Cần xác minh"
    : value;
}
const integrityLabels: Record<string, string> = {
  REPEATED_FULLSCREEN_EXIT: "Thoát toàn màn hình nhiều lần",
  REPEATED_PAGE_HIDDEN: "Rời tab nhiều lần",
  TELEMETRY_INCOMPLETE: "Dữ liệu giám sát không đầy đủ",
};
export function integrityReason(value: string) {
  return integrityLabels[value] ?? value;
}
export function questionScored(question: InterviewQuestion) {
  return question.points != null;
}
export function criterionFlagged(
  criterion: InterviewQuestion["criteria"][number],
) {
  return (
    !!criterion.needs_review ||
    criterion.review_reasons.length > 0 ||
    criterion.effective_score == null
  );
}

export function reviewDigest(data: InterviewPackage) {
  const flaggedCriteria = data.questions.flatMap((question) =>
    question.criteria.filter(criterionFlagged),
  );
  return {
    conflicts: data.report?.data_conflicts.length ?? 0,
    verifications: data.report?.verification_required.length ?? 0,
    unscoredQuestions: data.questions.filter((item) => !questionScored(item))
      .length,
    flaggedCriteria: flaggedCriteria.length,
    integrity: !!data.integrity_summary?.requires_review,
    scoreComplete: data.summary?.score_complete ?? false,
  };
}
