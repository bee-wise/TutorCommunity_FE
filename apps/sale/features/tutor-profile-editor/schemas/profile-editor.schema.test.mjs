import assert from "node:assert/strict";
import test from "node:test";
import { tutorProfileEditorSchema } from "./profile-editor.schema.ts";
import { buildTutorProfileEditorPayload } from "../utils/build-editor-payload.ts";

const validBaseProfile = {
  displayName: "Nguyễn Văn A",
  avatarUrl: "https://example.com/avatar.jpg",
  headline: "Gia sư Toán 12", // 14 chars, >= 12
  shortIntro: "Giúp học sinh hiểu sâu bản chất, nâng cao phản xạ tư duy và tự tin đạt điểm số cao.",
  university: "Đại học Sư phạm",
  major: "Sư phạm Toán",
  studentYear: "GRADUATED",
  subjects: [{ value: "Toán học" }],
  specializations: [],
  teachingModes: [{ value: "Online" }],
  area: "Hà Nội",
  hourlyRate: "200.000đ/giờ",
  availability: [{ day: "Thứ Hai", time: "18:00 - 20:00" }],
  experienceYears: "2 năm",
  introduction: [{ value: "Tôi có đam mê giảng dạy Toán học cho học sinh phổ thông." }],
  teachingMethods: [],
  education: [{ value: "Sư phạm Toán, Đại học Sư phạm" }],
  achievements: [],
  teachingHistory: [],
  certificates: [],
};

test("schema accepts valid 12-character headline and empty optional collections", () => {
  const result = tutorProfileEditorSchema.safeParse({
    ...validBaseProfile,
    headline: "Gia sư Toán!", // exactly 12 chars
    achievements: [],
    certificates: [],
    teachingHistory: [],
    teachingMethods: [],
    specializations: [],
  });
  assert.equal(result.success, true);
});

test("schema rejects headline shorter than 12 characters", () => {
  const result = tutorProfileEditorSchema.safeParse({
    ...validBaseProfile,
    headline: "Gia sư Toán", // 11 chars
  });
  assert.equal(result.success, false);
});

test("payload builder preserves canonical fields from base profile", () => {
  const baseTutor = {
    teachingOfferings: [
      {
        teachingItemId: "item-1",
        teachingMode: "ONLINE",
        basePrice: 200000,
      },
    ],
    dateOfBirth: "1998-05-12",
    gender: "male",
    studentCardUrl: "https://example.com/card.jpg",
    identityDocumentsUrl: "https://example.com/id.jpg",
    offlineCity: "Hà Nội",
    offlineDistrict: "Cầu Giấy",
    travelRadiusKm: 5,
    universityId: "uni-guid",
    majorId: "major-guid",
    specializationIds: ["spec-guid"],
  };

  const payload = buildTutorProfileEditorPayload(
    validBaseProfile,
    { videoUrl: "https://example.com/video.mp4" },
    baseTutor,
  );

  assert.equal(payload.headline, "Gia sư Toán 12");
  assert.equal(payload.videoUrl, "https://example.com/video.mp4");
  assert.equal(payload.dateOfBirth, "1998-05-12");
  assert.equal(payload.gender, "male");
  assert.equal(payload.studentCardUrl, "https://example.com/card.jpg");
  assert.equal(payload.identityDocumentsUrl, "https://example.com/id.jpg");
  assert.equal(payload.offlineCity, "Hà Nội");
  assert.equal(payload.offlineDistrict, "Cầu Giấy");
  assert.equal(payload.travelRadiusKm, 5);
  assert.equal(payload.universityId, "uni-guid");
  assert.equal(payload.majorId, "major-guid");
  assert.deepEqual(payload.specializationIds, ["spec-guid"]);
  assert.equal(Array.isArray(payload.teachingOfferings), true);
});
