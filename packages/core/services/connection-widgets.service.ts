import { z } from "zod";
import { apiClient } from "../configs/client";

const nullableString = z.string().nullish();

export const trialSessionSchema = z
  .object({
    id: z.string(),
    chatRoomId: z.string(),
    subject: nullableString,
    scheduledStartAt: nullableString,
    scheduledEndAt: nullableString,
    teachingMode: nullableString,
    locationOrMeetingInfo: nullableString,
    zoomUrl: nullableString,
    note: nullableString,
    status: nullableString,
    version: z.number().optional(),
    tutorConfirmedAt: nullableString,
    learnerConfirmedAt: nullableString,
  })
  .passthrough();

export const classConfirmationSchema = z
  .object({
    id: z.string(),
    chatRoomId: z.string(),
    trialSessionId: nullableString,
    subjectId: nullableString,
    subjectName: nullableString,
    tutorOfferingId: nullableString,
    teachingMode: nullableString,
    pricePerHour: z.number().nullish(),
    sessionDurationMinutes: z.number().nullish(),
    numberOfSessions: z.number().nullish(),
    totalAmount: z.number().nullish(),
    proposedSchedule: nullableString,
    status: nullableString,
    version: z.number().optional(),
    classId: nullableString,
    learnerConfirmedAt: nullableString,
    tutorConfirmedAt: nullableString,
  })
  .passthrough();

export const paymentRequestSchema = z
  .object({
    id: z.string(),
    classId: z.string(),
    orderCode: z.union([z.string(), z.number()]).nullish(),
    amount: z.number().nullish(),
    currency: nullableString,
    provider: nullableString,
    checkoutUrl: nullableString,
    qrCodeUrl: nullableString,
    status: nullableString,
    expiredAt: nullableString,
    paidAt: nullableString,
  })
  .passthrough();

export const classSessionSchema = z
  .object({
    id: z.string(),
    classId: z.string(),
    startAt: z.string(),
    endAt: z.string(),
    teachingMode: nullableString,
    locationOrMeetingInfo: nullableString,
    status: nullableString,
  })
  .passthrough();

export const learningClassSchema = z
  .object({
    id: z.string(),
    status: nullableString,
    numberOfSessions: z.number().nullish(),
    totalAmount: z.number().nullish(),
  })
  .passthrough();

export type TrialSession = z.infer<typeof trialSessionSchema>;
export type ClassConfirmation = z.infer<typeof classConfirmationSchema>;
export type PaymentRequest = z.infer<typeof paymentRequestSchema>;
export type ClassSession = z.infer<typeof classSessionSchema>;
export type ClassSessionSlot = {
  startAt: string;
  endAt: string;
  locationOrMeetingInfo?: string;
};
export type CreateTrialSession = {
  subject: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  teachingMode: "ONLINE" | "OFFLINE";
  zoomUrl?: string | null;
  locationOrMeetingInfo?: string | null;
  note?: string | null;
};
export type UpdateClassConfirmation = {
  subjectId: string;
  teachingMode: "ONLINE" | "OFFLINE";
  sessionDurationMinutes: number;
  numberOfSessions: number;
  proposedSchedule: string;
  expectedVersion: number;
  tutorOfferingId: string;
};

function dataOf<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const envelope = z
    .object({ success: z.literal(true), data: z.unknown() })
    .safeParse(value);
  if (!envelope.success)
    throw new Error("Phản hồi widget từ máy chủ không hợp lệ.");
  const parsed = schema.safeParse(envelope.data.data);
  if (!parsed.success)
    throw new Error("Dữ liệu widget từ máy chủ không hợp lệ.");
  return parsed.data;
}

const idPath = (id: string) => encodeURIComponent(id);
const trialListSchema = z.object({
  items: z.array(trialSessionSchema).nullish(),
});

export const connectionWidgetsService = {
  async listTrials(roomId: string) {
    const response: unknown = await apiClient.get(
      `/chat-rooms/${idPath(roomId)}/trial-sessions`,
    );
    return dataOf(trialListSchema, response).items ?? [];
  },
  async createTrial(roomId: string, input: CreateTrialSession) {
    const response: unknown = await apiClient.post(
      `/chat-rooms/${idPath(roomId)}/trial-sessions`,
      input,
    );
    return dataOf(trialSessionSchema, response);
  },
  async getTrial(id: string) {
    const response: unknown = await apiClient.get(
      `/trial-sessions/${idPath(id)}`,
    );
    return dataOf(trialSessionSchema, response);
  },
  async completeTrial(id: string, expectedVersion: number, note?: string) {
    const response: unknown = await apiClient.post(
      `/trial-sessions/${idPath(id)}/complete`,
      { expectedVersion, note: note || null },
    );
    return dataOf(trialSessionSchema, response);
  },
  async confirmTrial(id: string, expectedVersion: number) {
    const response: unknown = await apiClient.post(
      `/trial-sessions/${idPath(id)}/confirm`,
      { expectedVersion },
    );
    return dataOf(trialSessionSchema, response);
  },
  async listClassConfirmations(roomId: string) {
    const response: unknown = await apiClient.get(
      `/chat-rooms/${idPath(roomId)}/class-confirmations`,
    );
    return dataOf(z.array(classConfirmationSchema), response);
  },
  async getClassConfirmation(id: string) {
    const response: unknown = await apiClient.get(
      `/class-confirmations/${idPath(id)}`,
    );
    return dataOf(classConfirmationSchema, response);
  },
  async updateClassConfirmation(id: string, input: UpdateClassConfirmation) {
    const response: unknown = await apiClient.put(
      `/class-confirmations/${idPath(id)}`,
      input,
    );
    return dataOf(classConfirmationSchema, response);
  },
  async confirmClassConfirmation(id: string, expectedVersion: number) {
    const response: unknown = await apiClient.post(
      `/class-confirmations/${idPath(id)}/confirm`,
      { expectedVersion },
    );
    return dataOf(classConfirmationSchema, response);
  },
  async getClass(id: string) {
    const response: unknown = await apiClient.get(`/classes/${idPath(id)}`);
    return dataOf(learningClassSchema, response);
  },
  async getPayment(id: string) {
    const response: unknown = await apiClient.get(
      `/payment-requests/${idPath(id)}`,
    );
    return dataOf(paymentRequestSchema, response);
  },
  async createPayment(classId: string) {
    const response: unknown = await apiClient.post(
      `/classes/${idPath(classId)}/payment-requests`,
    );
    return dataOf(paymentRequestSchema, response);
  },
  async getSessions(classId: string) {
    const response: unknown = await apiClient.get(
      `/classes/${idPath(classId)}/sessions`,
    );
    return dataOf(z.array(classSessionSchema), response);
  },
  async previewSessions(classId: string, sessions: ClassSessionSlot[]) {
    const response: unknown = await apiClient.post(
      `/classes/${idPath(classId)}/sessions/preview`,
      { sessions },
    );
    return dataOf(
      z.object({
        sessions: z.array(z.unknown()),
        conflicts: z.array(z.unknown()),
      }),
      response,
    );
  },
  async createSessions(
    classId: string,
    sessions: ClassSessionSlot[],
    submitKey: string,
  ) {
    const response: unknown = await apiClient.post(
      `/classes/${idPath(classId)}/sessions`,
      { sessions, submitKey },
    );
    return dataOf(
      z.object({
        sessions: z.array(classSessionSchema),
        conflicts: z.array(z.unknown()),
      }),
      response,
    );
  },
};
