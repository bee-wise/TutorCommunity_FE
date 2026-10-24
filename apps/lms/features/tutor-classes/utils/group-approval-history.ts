import { z } from "zod";

// `changes` is a JSON string from the API, e.g.
// {"note": null, "Version": 5, "ApprovalStatus": "PENDING"}; keys vary in casing.
const changesSchema = z.record(z.string(), z.unknown());

export interface ApprovalHistoryView {
  title: string;
  status: string | null;
  note: string | null;
}

const actionTitles: [RegExp, string][] = [
  [/SUBMIT/, "Gửi BeeWise duyệt"],
  [/REQUEST_CHANGES|CHANGES_REQUESTED/, "Yêu cầu chỉnh sửa"],
  [/REJECT/, "Từ chối lớp"],
  [/APPROVE/, "Duyệt lớp"],
  [/REVIEW/, "Xét duyệt lớp"],
  [/PUBLISH/, "Công khai tuyển sinh"],
  [/ROADMAP/, "Cập nhật lộ trình"],
  [/CREATE/, "Tạo bản nháp"],
  [/UPDATE/, "Cập nhật thông tin lớp"],
  [/ACTIVATE/, "Khai giảng lớp"],
  [/COMPLETE/, "Kết thúc lớp"],
];

const statusTitles: Record<string, string> = {
  APPROVED: "Duyệt lớp",
  REJECTED: "Từ chối lớp",
  CHANGES_REQUESTED: "Yêu cầu chỉnh sửa",
  REQUEST_CHANGES: "Yêu cầu chỉnh sửa",
};

function field(changes: Record<string, unknown>, name: string) {
  const key = Object.keys(changes).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return key === undefined ? null : changes[key];
}

export function toApprovalHistoryView(
  action?: string | null,
  changes?: string | null,
): ApprovalHistoryView {
  let parsed: Record<string, unknown> = {};
  try {
    const result = changesSchema.safeParse(JSON.parse(changes ?? ""));
    if (result.success) parsed = result.data;
  } catch {
    // Not JSON: keep the defaults, never show the raw payload.
  }
  const statusValue = field(parsed, "approvalStatus");
  const status = typeof statusValue === "string" ? statusValue : null;
  const noteValue = field(parsed, "note") ?? field(parsed, "reason");
  const note =
    typeof noteValue === "string" && noteValue.trim() ? noteValue.trim() : null;
  const code = (action ?? "").toUpperCase();
  const isReview = /REVIEW/.test(code) && !/SUBMIT/.test(code);
  const title =
    (isReview && status && statusTitles[status]) ||
    actionTitles.find(([pattern]) => pattern.test(code))?.[1] ||
    "Cập nhật lớp";
  return { title, status, note };
}
