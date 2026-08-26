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
  hourlyRate: mockTutorProfile.hourlyRate,
  availability: toAvailabilityItems(mockTutorProfile.availability),
  experienceYears: mockTutorProfile.experienceYears,
  introduction: toListItems(mockTutorProfile.introduction),
  teachingMethods: mockTutorProfile.teachingMethods.map((item) => ({ ...item })),
  education: toListItems(mockTutorProfile.education),
  achievements: toListItems(mockTutorProfile.achievements),
  teachingHistory: mockTutorProfile.teachingHistory.map((item) => ({ ...item })),
  certificates: mockTutorProfile.certificates.map((item, index) => ({
    ...item,
    imageUrl: `/images/TutorEvidence/certi-${(index % 3) + 1}.png`,
    status: item.status ?? "Đã xác minh",
  })),
};
