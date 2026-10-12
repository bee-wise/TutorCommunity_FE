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
