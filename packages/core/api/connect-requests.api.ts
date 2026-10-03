import { z } from "zod";
import { apiClient } from "../configs/client";
import {
  connectRequestEligibilitySchema,
  createdConnectRequestSchema,
  createConnectRequestSchema,
  outboundConnectRequestPageSchema,
} from "../schemas/connect-requests.schema";
import type {
  ConnectRequestEligibility,
  CreatedConnectRequest,
  CreateConnectRequestInput,
  OutboundConnectRequest,
} from "../types/connect-requests.type";

function parseData<T>(raw: unknown, schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } }, message: string): T {
  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(raw);
  if (!envelope.success) throw new Error(message);
  const parsed = schema.safeParse(envelope.data.data);
  if (!parsed.success) throw new Error(message);
  return parsed.data;
}

export const connectRequestsApi = {
  async getEligibility(): Promise<ConnectRequestEligibility> {
    const raw: unknown = await apiClient.get("/connect-requests/eligibility", { timeout: 10_000 });
    return parseData(raw, connectRequestEligibilitySchema, "Không đọc được trạng thái kết nối từ máy chủ.");
  },

  async create(input: CreateConnectRequestInput): Promise<CreatedConnectRequest | null> {
    const body = createConnectRequestSchema.safeParse(input);
    if (!body.success) throw new Error("Mã tài khoản gia sư không hợp lệ. Vui lòng tải lại hồ sơ và thử lại.");
    const raw: unknown = await apiClient.post("/connect-requests", body.data);
    // Swagger hiện mô tả 201 không có body. Nếu BE trả body, dùng chatRoomId trực tiếp.
    if (raw == null || raw === "") return null;
    const envelope = raw && typeof raw === "object" && "data" in raw
      ? (raw as { data: unknown }).data : raw;
    if (envelope == null || envelope === "") return null;
    const parsed = createdConnectRequestSchema.safeParse(envelope);
    return parsed.success ? parsed.data : null;
  },

  async listOutbound(): Promise<OutboundConnectRequest[]> {
    const raw: unknown = await apiClient.get("/connect-requests", {
      params: { direction: "outbound", page: 1, pageSize: 50 },
      timeout: 10_000,
    });
    const page = parseData(raw, outboundConnectRequestPageSchema, "Không tải được kết nối vừa tạo.");
    return page.items ?? [];
  },
};
