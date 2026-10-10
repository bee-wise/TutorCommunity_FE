import { z } from "zod";

export const createTrialSessionRequestSchema = z.strictObject({
  tutorOfferingId: z.guid(),
  scheduledStartAt: z.iso.datetime(),
  scheduledEndAt: z.iso.datetime(),
  zoomUrl: z.string().nullish(),
  note: z.string().nullish(),
  teachingMode: z.enum(["ONLINE", "OFFLINE"]),
  locationOrMeetingInfo: z.string().trim().min(1),
});

export type CreateTrialSession = z.infer<typeof createTrialSessionRequestSchema>;
