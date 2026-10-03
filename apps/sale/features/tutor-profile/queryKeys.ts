export const tutorProfileQueryKeys = {
  detail: (id: string) => ["tutor-profile", id] as const,
  views: (id: string) => ["tutor-profile", id, "views"] as const,
};

