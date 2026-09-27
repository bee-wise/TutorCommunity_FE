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
    dateOfBirth: "2003-05-15",
    gender: "female",
    introduction: listValues(values.introduction).join("\n\n"),
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
    subjects: listValues(values.subjects),
    specializations: listValues(values.specializations),
    teachingModes: listValues(values.teachingModes),
    area: values.area,
    hourlyRate: typeof values.hourlyRate === "number" ? values.hourlyRate : parseInt(values.hourlyRate.replace(/\D/g, ""), 10) || 120000,
    availability: values.availability.map((slot) => ({ ...slot })),
    experienceYears: values.experienceYears,
    achievements: values.certificates.map((item) => ({
      title: item.title,
      type: item.type,
      imageUrl: item.imageUrl,
      status: item.status,
      description: item.description,
    })),
    teachingMethods: values.teachingMethods.map((item) => ({ ...item })),
    teachingHistory: values.teachingHistory.map((item) => ({ ...item })),
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
