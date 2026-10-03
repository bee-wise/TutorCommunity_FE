import { z } from "zod";

const nullableText = z.string().nullish();
const nullableUuid = z.uuid().nullish();

export const pendingProfileFieldSchema = z.object({
  requestId: z.uuid(),
  fieldName: nullableText,
  oldValue: nullableText,
  newValue: nullableText,
  reviewLevel: nullableText,
  status: nullableText,
  requestedAt: z.string(),
});

export const pendingProfileSchema = z.object({
  profileId: z.uuid(),
  tutorUserId: z.uuid(),
  tutorEmail: nullableText,
  tutorFullName: nullableText,
  displayName: nullableText,
  profileHeadline: nullableText,
  universityName: nullableText,
  major: nullableText,
  studentCardUrl: nullableText,
  identityDocumentsUrl: nullableText,
  status: nullableText,
  isPublic: z.boolean(),
  isPendingUpdate: z.boolean(),
  submittedAt: z.string(),
  updatedAt: z.string(),
  fields: z.array(pendingProfileFieldSchema).nullish(),
});

export const pendingFieldChangeSchema = z.object({
  requestId: z.uuid(),
  targetTable: nullableText,
  targetId: z.uuid(),
  profileId: nullableUuid,
  requestedBy: z.uuid(),
  requestedByEmail: nullableText,
  requestedByFullName: nullableText,
  fieldName: nullableText,
  oldValue: nullableText,
  newValue: nullableText,
  reviewLevel: nullableText,
  status: nullableText,
  requestedAt: z.string(),
});

export const reviewListSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  profiles: z.array(pendingProfileSchema).nullish(),
  fieldChanges: z.array(pendingFieldChangeSchema).nullish(),
});

const offeringSchema = z.object({
  id: nullableUuid,
  programVersionId: z.uuid().nullish(),
  teachingItemId: nullableUuid,
  contextId: nullableUuid,
  teachingMode: nullableText,
  basePrice: z.number().nullish(),
  proposal: z.object({
    teachingItemName: nullableText,
    contextName: nullableText,
    contextType: nullableText,
  }).nullish(),
});

export const tutorProfileSubmissionSchema = z.object({
  teachingOfferings: z.array(offeringSchema).nullish(),
  displayName: nullableText,
  dateOfBirth: nullableText,
  gender: nullableText,
  avatarUrl: nullableText,
  headline: nullableText,
  universityId: nullableUuid,
  majorId: nullableUuid,
  studentYear: nullableText,
  studentCardUrl: nullableText,
  hourlyRate: z.array(z.object({ subjectId: z.uuid(), price: z.number() })).nullish(),
  introduction: nullableText,
  shortIntro: nullableText,
  videoUrl: nullableText,
  experienceYears: z.number().nullish(),
  area: nullableText,
  offlineCity: nullableText,
  offlineDistrict: nullableText,
  offlineWard: nullableText,
  offlineAddressDetail: nullableText,
  travelRadiusKm: z.number().int().nullish(),
  identityDocumentsUrl: nullableText,
  bankInformation: z.unknown().optional(),
  availability: z.array(z.object({ day: z.string(), time: z.string() })).nullish(),
  teachingMethods: z.array(z.object({ title: z.string(), description: z.string() })).nullish(),
  achievements: z.array(z.object({
    id: nullableUuid,
    type: z.string(),
    title: z.string(),
    issuer: nullableText,
    score: nullableText,
    startDate: nullableText,
    endDate: nullableText,
    imageUrl: nullableText,
    description: nullableText,
  })).nullish(),
  teachingHistory: z.array(z.object({
    id: nullableUuid,
    title: z.string(),
    organization: nullableText,
    detail: nullableText,
    outcome: nullableText,
    startDate: nullableText,
    endDate: nullableText,
    isCurrent: z.boolean(),
  })).nullish(),
  subjectIds: z.array(z.uuid()).nullish(),
  gradeLevelIds: z.array(z.uuid()).nullish(),
  specializationIds: z.array(z.uuid()).nullish(),
  teachingModes: z.array(z.string()).nullish(),
});

export const rejectedFieldSchema = z.object({
  offeringId: nullableUuid,
  fieldName: z.string().trim().min(1),
  rejectionReason: z.string().trim().min(1, "Nhập lý do từ chối cho field này."),
});

const rejectedFieldResponseSchema = z.object({
  offeringId: nullableUuid,
  fieldName: nullableText,
  rejectionReason: nullableText,
});

export const reviewSubmissionSchema = z.object({
  rejectedFields: z.array(rejectedFieldSchema),
  note: nullableText,
});

export const profileReviewSchema = z.object({
  profileId: z.uuid(),
  status: nullableText,
  reviewedAt: nullableText,
  profile: tutorProfileSubmissionSchema,
  rejectedFields: z.array(rejectedFieldResponseSchema).nullish(),
});

export type ReviewList = z.infer<typeof reviewListSchema>;
export type PendingProfile = z.infer<typeof pendingProfileSchema>;
export type PendingFieldChange = z.infer<typeof pendingFieldChangeSchema>;
export type TutorProfileSubmission = z.infer<typeof tutorProfileSubmissionSchema>;
export type ProfileReview = z.infer<typeof profileReviewSchema>;
export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;
