import { z } from "zod";

const metricSchema = z.object({
  value: z.number().finite(),
  isMock: z.boolean(),
  source: z.string().nullish(),
});

export const dashboardSchema = z.object({
  generatedAt: z.string().nullish(),
  range: z
    .object({ from: z.string().nullish(), to: z.string().nullish() })
    .nullish(),
  granularity: z.string().nullish(),
  summary: z.object({
    totalUsers: metricSchema.nullish(),
    totalTutors: metricSchema.nullish(),
    approvedTutors: metricSchema.nullish(),
    pendingReviewProfiles: metricSchema.nullish(),
    rejectedProfiles: metricSchema.nullish(),
    onlineTutors: metricSchema.nullish(),
    totalSearches: metricSchema.nullish(),
    totalAiSearches: metricSchema.nullish(),
    totalConnectRequests: metricSchema.nullish(),
    totalChatRooms: metricSchema.nullish(),
    averageResponseTimeSeconds: metricSchema.nullish(),
    recentAuditCount: metricSchema.nullish(),
  }),
});

export type DashboardData = z.infer<typeof dashboardSchema>;
export type DashboardMetric = z.infer<typeof metricSchema>;
