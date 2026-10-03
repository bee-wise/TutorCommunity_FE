import { z } from "zod";

export const createConnectRequestSchema = z.object({
  tutorId: z.guid(),
});

export const connectRequestEligibilitySchema = z.object({
  canCreateConnection: z.boolean(),
  blockingReason: z.string().nullable().optional(),
  requiresConsultantSupport: z.boolean().optional(),
  activeConnectRequestId: z.guid().nullable().optional(),
  activeChatRoomId: z.guid().nullable().optional(),
  activeTutorId: z.guid().nullable().optional(),
  connectionStatus: z.string().nullable().optional(),
  connectionStage: z.string().nullable().optional(),
});

export const createdConnectRequestSchema = z.object({
  connectRequestId: z.guid().optional(),
  chatRoomId: z.guid().optional(),
});

export const outboundConnectRequestPageSchema = z.object({
  items: z.array(z.object({
    id: z.guid(),
    tutorId: z.guid(),
    chatRoomId: z.guid().nullable().optional(),
    status: z.string().nullable().optional(),
    createdAt: z.string().optional(),
  })).nullable(),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    totalItems: z.number().int(),
    totalPages: z.number().int(),
  }),
});
