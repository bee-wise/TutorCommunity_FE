import { tutorProfileFormSchema } from "../schemas/profile-registration.schema";

export type ProfileStepIndex = 0 | 1 | 2 | 3;

export type ProfileStepIssue = {
  key: string;
  label: string;
  message: string;
};

const FIELD_STEPS: Record<string, ProfileStepIndex> = {
  displayName: 0,
  dateOfBirth: 0,
  gender: 0,
  avatarUrl: 0,
  universityId: 0,
  majorId: 0,
  studentYear: 0,
  studentCardUrl: 0,
  identityDocumentsUrl: 0,
  hourlyRate: 1,
  experienceYears: 1,
  subjectIds: 1,
  gradeLevelIds: 1,
  specializationIds: 1,
  teachingModes: 1,
  headline: 2,
  introduction: 2,
  shortIntro: 2,
  videoUrl: 2,
  teachingMethods: 2,
  area: 3,
  offlineCity: 3,
  offlineDistrict: 3,
  offlineWard: 3,
  offlineAddressDetail: 3,
  travelRadiusKm: 3,
  bankInformation: 3,
  availability: 3,
  achievements: 3,
  teachingHistory: 3,
};

const FIELD_LABELS: Record<string, string> = {
  displayName: "Tên hiển thị",
  dateOfBirth: "Ngày sinh",
  gender: "Giới tính",
  avatarUrl: "Ảnh đại diện",
  universityId: "Trường đại học",
  majorId: "Chuyên ngành",
  studentYear: "Năm học / tình trạng học tập",
  studentCardUrl: "Thẻ sinh viên / bằng tốt nghiệp",
  identityDocumentsUrl: "Giấy tờ tùy thân",
  hourlyRate: "Học phí theo môn",
  experienceYears: "Số năm kinh nghiệm",
  subjectIds: "Môn giảng dạy",
  gradeLevelIds: "Cấp học",
  specializationIds: "Chuyên môn nổi bật",
  teachingModes: "Hình thức dạy",
  headline: "Tiêu đề hồ sơ",
  introduction: "Giới thiệu chi tiết",
  shortIntro: "Giới thiệu ngắn",
  videoUrl: "Video giới thiệu",
  teachingMethods: "Phương pháp giảng dạy",
  area: "Khu vực giảng dạy",
  offlineCity: "Tỉnh / thành phố",
  offlineDistrict: "Quận / huyện",
  offlineWard: "Phường / xã",
  offlineAddressDetail: "Địa chỉ chi tiết",
  travelRadiusKm: "Bán kính di chuyển",
  bankInformation: "Thông tin ngân hàng",
  availability: "Lịch có thể dạy",
  achievements: "Thành tích và chứng chỉ",
  teachingHistory: "Kinh nghiệm giảng dạy",
};

function indexedLabel(path: PropertyKey[], fallback: string): string {
  const collection = path[0];
  const index = typeof path[1] === "number" ? path[1] + 1 : null;
  const field = path[2];

  if (index === null) return fallback;
  if (collection === "hourlyRate") return `Học phí môn ${index}`;
  if (collection === "teachingMethods") {
    return field === "description"
      ? `Mô tả phương pháp ${index}`
      : `Tên phương pháp ${index}`;
  }
  if (collection === "availability") return `Khung giờ dạy ${index}`;
  if (collection === "achievements") return `Thành tích ${index}`;
  if (collection === "teachingHistory") return `Kinh nghiệm ${index}`;
  return fallback;
}

export function getProfileStepIssues(values: unknown): ProfileStepIssue[][] {
  const result = tutorProfileFormSchema.safeParse(values);
  const grouped: ProfileStepIssue[][] = [[], [], [], []];
  if (result.success) return grouped;

  const seen = new Set<string>();
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;
    const step = FIELD_STEPS[field];
    if (step === undefined) continue;

    const label = indexedLabel(issue.path, FIELD_LABELS[field] ?? field);
    const key = `${issue.path.join(".")}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    grouped[step].push({ key, label, message: issue.message });
  }

  return grouped;
}
