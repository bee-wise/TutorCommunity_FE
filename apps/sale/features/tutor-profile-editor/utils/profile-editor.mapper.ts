import type { TutorProfileData } from "../../tutor-profile/types/mockTutorProfile";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";

const listValues = (items: Array<{ value: string }>): string[] =>
  items.map((item) => item.value.trim()).filter(Boolean);

export function mapEditorValuesToTutorProfile(
  values: TutorProfileEditorValues,
): TutorProfileData {
  return {
    id: "nguyen-minh-anh-preview",
    displayName: values.displayName,
    avatarUrl: values.avatarUrl || "/images/Tutor/1.png",
    headline: values.headline,
    shortIntro: values.shortIntro,
    university: values.university,
    major: values.major,
    studentYear: values.studentYear,
    rating: 4.8,
    reviewCount: 24,
    responseTime: "Thường phản hồi trong 15 phút",
    teachingHours: "350+ giờ dạy đã duyệt",
    onlineStatus: "Đang nhận học sinh mới",
    subjects: listValues(values.subjects),
    specializations: listValues(values.specializations),
    teachingModes: listValues(values.teachingModes),
    area: values.area,
    hourlyRate: values.hourlyRate,
    availability: values.availability.map((slot) => ({ ...slot })),
    experienceYears: values.experienceYears,
    achievements: listValues(values.achievements),
    introduction: listValues(values.introduction),
    teachingMethods: values.teachingMethods.map((item) => ({ ...item })),
    education: listValues(values.education),
    teachingHistory: values.teachingHistory.map((item) => ({ ...item })),
    certificates: values.certificates.map((item) => ({ ...item })),
    reviews: [
      {
        author: "Chị Hạnh",
        relationship: "Phụ huynh học sinh lớp 8",
        rating: 5,
        quote:
          "Con mình hiểu bài nhanh hơn và không còn sợ môn Toán. Bạn giảng dễ hiểu và rất kiên nhẫn.",
      },
    ],
  };
}
