const dateFields = new Set(["dateOfBirth", "startDate", "endDate", "effectiveFrom"]);
const moneyFields = new Set(["basePrice", "price"]);

const genderLabels: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHERS: "Khác",
  OTHER: "Khác",
};

const studentYearLabels: Record<string, string> = {
  YEAR_1: "Sinh viên năm 1",
  YEAR_2: "Sinh viên năm 2",
  YEAR_3: "Sinh viên năm 3",
  YEAR_4: "Sinh viên năm 4",
  YEAR_5: "Sinh viên năm 5",
  YEAR_6: "Sinh viên năm 6",
  GRADUATED: "Đã tốt nghiệp",
};

const teachingModeLabels: Record<string, string> = {
  ONLINE: "Trực tuyến",
  OFFLINE: "Trực tiếp",
};

const achievementTypeLabels: Record<string, string> = {
  CERTIFICATE: "Chứng chỉ",
  AWARD: "Giải thưởng",
  ACADEMIC: "Học thuật",
};

const contextTypeLabels: Record<string, string> = {
  GRADE: "Lớp học",
  LEVEL: "Trình độ",
  MAJOR: "Chuyên ngành",
  EXAM_TRACK: "Hướng luyện thi",
  CERT_LEVEL: "Cấp chứng chỉ",
  OTHER: "Khác",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatReviewFieldText(fieldName: string | undefined, value: string): string {
  const key = fieldName?.split(/[.[\]]+/).filter(Boolean).at(-1);
  const normalized = value.trim().toUpperCase();
  if (key === "gender") return genderLabels[normalized] ?? value;
  if (key === "studentYear") return studentYearLabels[normalized] ?? value;
  if (key === "teachingMode" || key === "teachingModes") return teachingModeLabels[normalized] ?? value;
  if (key === "type") return achievementTypeLabels[normalized] ?? value;
  if (key === "contextType") return contextTypeLabels[normalized] ?? value;

  if (key && dateFields.has(key)) {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(value);
    if (!match) return value;
    const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`);
    if (date.getUTCFullYear() !== Number(match[1]) ||
      date.getUTCMonth() + 1 !== Number(match[2]) ||
      date.getUTCDate() !== Number(match[3])) return value;
    return dateFormatter.format(date);
  }

  return value;
}

export function formatReviewFieldNumber(fieldName: string | undefined, value: number): string {
  const key = fieldName?.split(/[.[\]]+/).filter(Boolean).at(-1);
  return key && moneyFields.has(key)
    ? currencyFormatter.format(value)
    : value.toLocaleString("vi-VN");
}

export function formatReviewPreview(fieldName: string | null | undefined, raw: string | null | undefined): string {
  if (!raw) return "Chưa cung cấp";
  let value: unknown = raw;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    // API cũng có thể trả chuỗi thuần.
  }
  if (value === null || value === "") return "Chưa cung cấp";
  if (typeof value === "string") {
    if (["universityId", "majorId", "specializationIds"].includes(fieldName ?? "") &&
      /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value)) return "Xem tên danh mục trong chi tiết";
    return formatReviewFieldText(fieldName ?? undefined, value);
  }
  if (typeof value === "number") return formatReviewFieldNumber(fieldName ?? undefined, value);
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (Array.isArray(value)) {
    if (!value.length) return "Chưa có mục nào";
    if (value.every((item) => typeof item === "string")) {
      const labels = value.map((item) => formatReviewFieldText(fieldName ?? undefined, item));
      return labels.every((item) => !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(item))
        ? labels.join(", ")
        : `${value.length} mục đã chọn`;
    }
    return `${value.length} mục được cập nhật`;
  }
  return "Thông tin chi tiết được cập nhật";
}
