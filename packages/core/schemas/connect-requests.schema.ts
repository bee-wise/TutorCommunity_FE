import { z } from "zod";

export const createConnectRequestSchema = z.object({
  tutorId: z.uuid(),
});

export const connectRequestEligibilitySchema = z.object({
  canCreateConnection: z.boolean(),
  blockingReason: z.string().nullable().optional(),
  requiresConsultantSupport: z.boolean().optional(),
  activeConnectRequestId: z.uuid().nullable().optional(),
  activeChatRoomId: z.uuid().nullable().optional(),
  activeTutorId: z.uuid().nullable().optional(),
  connectionStatus: z.string().nullable().optional(),
  connectionStage: z.string().nullable().optional(),
});

export const createdConnectRequestSchema = z.object({
  connectRequestId: z.uuid().optional(),
  chatRoomId: z.uuid().optional(),
});

export const outboundConnectRequestPageSchema = z.object({
  items: z.array(z.object({
    id: z.uuid(),
    tutorId: z.uuid(),
    chatRoomId: z.uuid().nullable().optional(),
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
