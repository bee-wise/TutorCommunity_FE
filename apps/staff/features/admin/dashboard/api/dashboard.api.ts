import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import type { DashboardRange } from "../data/dashboardRange";
import { dashboardSchema, type DashboardData } from "../schemas/dashboard.schema";

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string().nullish(),
  data: dashboardSchema.nullish(),
});

export async function getAdminDashboard(range: DashboardRange): Promise<DashboardData> {
  const response: unknown = await apiClient.get("/admin/dashboard", {
    params: {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
      useMock: false,
    },
  });
  const result = responseSchema.parse(response);
  if (!result.success || !result.data) {
    throw new Error(result.message || "Không thể tải dữ liệu dashboard.");
  }
  return result.data;
}
