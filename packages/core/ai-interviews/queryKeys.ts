export interface InterviewListParams { status?: string; limit: number; offset: number }
export const interviewKeys = {
  all: ["ai-interviews"] as const,
  policy: (userId: string) => ["ai-interviews", userId, "policy"] as const,
  eligibility: (userId: string) => ["ai-interviews", userId, "eligibility"] as const,
  state: (userId: string, id: string) => ["ai-interviews", userId, "state", id] as const,
  list: (userId: string, params: InterviewListParams) => ["ai-interviews", userId, "list", params] as const,
  package: (userId: string, id: string) => ["ai-interviews", userId, "package", id] as const,
  audit: (userId: string, entity: string, id: string) => ["ai-interviews", userId, "audit", entity, id] as const,
  policies: (userId: string) => ["ai-interviews", userId, "policies"] as const,
  rubrics: (userId: string) => ["ai-interviews", userId, "rubrics"] as const,
  rubric: (userId: string, version: string) => ["ai-interviews", userId, "rubric", version] as const,
};
