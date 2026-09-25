import { mockTutorProfile } from "../../tutor-profile/types/mockTutorProfile";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { normalizeTeachingMode } from "./profile-editor.options";

const toListItems = (items: string[]) =>
  items.map((value) => ({ value }));

const toAvailabilityItems = (slots: Array<{ day: string; time: string }>) =>
  slots.flatMap((slot) => {
    const days = slot.day.split(",").map((day, index) => {
      const normalizedDay = day.trim();
      return index === 0 || normalizedDay === "Chủ nhật"
        ? normalizedDay
        : `Thứ ${normalizedDay}`;
    });
    return days.map((day) => ({ day, time: slot.time }));
  });

export const tutorProfileEditorDefaultValues: TutorProfileEditorValues = {
  displayName: mockTutorProfile.displayName,
  avatarUrl: mockTutorProfile.avatarUrl,
  headline: mockTutorProfile.headline,
  shortIntro: mockTutorProfile.shortIntro,
  university: mockTutorProfile.university,
  major: mockTutorProfile.major,
  studentYear: mockTutorProfile.studentYear,
  subjects: toListItems(mockTutorProfile.subjects),
  specializations: toListItems(mockTutorProfile.specializations),
  teachingModes: [{ value: normalizeTeachingMode(mockTutorProfile.teachingModes) }],
  area: mockTutorProfile.area,
  hourlyRate: `${mockTutorProfile.hourlyRate.toLocaleString("vi-VN")}đ/giờ`,
  availability: toAvailabilityItems(mockTutorProfile.availability),
  experienceYears: mockTutorProfile.experienceYears,
  introduction: toListItems(mockTutorProfile.introduction.split("\n\n")),
  teachingMethods: mockTutorProfile.teachingMethods.map((item) => ({ ...item })),
  education: toListItems([
    `${mockTutorProfile.major}, ${mockTutorProfile.university}`,
    mockTutorProfile.studentYear,
  ]),
  achievements: mockTutorProfile.achievements.map((item) => ({ value: item.title })),
  teachingHistory: mockTutorProfile.teachingHistory.map((item) => ({ ...item })),
  certificates: mockTutorProfile.achievements.map((item, index) => ({
    title: item.title,
    type: item.type,
    description: item.description,
    imageUrl: item.imageUrl ?? `/images/TutorEvidence/certi-${(index % 3) + 1}.png`,
    status: item.status ?? "Đã xác minh",
  })),
};
