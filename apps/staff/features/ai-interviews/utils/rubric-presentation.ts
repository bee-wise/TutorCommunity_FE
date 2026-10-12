export const rubricFieldLabels: Record<string, string> = {
  questions: "Câu hỏi",
  criteria: "Tiêu chí chấm điểm",
  thresholds: "Ngưỡng đánh giá",
  timing: "Thời gian",
  prep_seconds: "Thời gian chuẩn bị (giây)",
  answer_seconds: "Thời gian trả lời (giây)",
  weight: "Trọng số",
  max_points: "Điểm tối đa",
  levels: "Thang điểm 0–4",
  title: "Tiêu đề",
  text: "Nội dung",
  prompt: "Câu hỏi phỏng vấn",
  objective: "Mục tiêu",
  description: "Mô tả",
  intro: "Lời mở đầu",
  outro: "Lời kết",
  language: "Ngôn ngữ",
  version: "Phiên bản nguồn",
  followup: "Câu hỏi bổ sung",
  q_code: "Mã câu hỏi",
  criterion_code: "Mã tiêu chí",
  meta: "Thông tin chung",
  pass: "Ngưỡng đạt",
  weights: "Trọng số",
};

export function rubricEntryTitle(value: unknown, fallback: string) {
  if (value == null || typeof value !== "object" || Array.isArray(value))
    return fallback;
  const item = value as Record<string, unknown>;
  const title = [
    item.q_code ?? item.criterion_code,
    item.title ?? item.description,
  ]
    .filter((entry) => typeof entry === "string" && entry.trim())
    .join(" · ");
  return title || fallback;
}
