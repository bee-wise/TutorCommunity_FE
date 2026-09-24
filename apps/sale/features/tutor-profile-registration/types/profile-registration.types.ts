export const catalogResources = [
  "universities",
  "majors",
  "subjects",
  "grade_levels",
  "specializations",
] as const;

export type CatalogResource = (typeof catalogResources)[number];

export interface CatalogItem {
  id: string;
  name: string;
  source: string;
  isApproved: boolean;
  sortOrder: number | null;
}

export interface FileUploadResult {
  url: string;
}

export interface TutorProfileMutationResult {
  tutorProfileStatus?: string | null;
}

export interface PendingNavigation {
  href: string;
}
