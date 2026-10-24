import type { TutorProfileFormValues } from "../../tutor-profile-registration/schemas/profile-registration.schema";

export type ProfileBlockId =
  | "basic"
  | "introduction"
  | "methods"
  | "academic"
  | "video"
  | "experience"
  | "evidence"
  | "teaching";

export type ProfileFieldName = keyof TutorProfileFormValues;

export type ProfileSectionPatch = Partial<TutorProfileFormValues>;
