import { z } from "zod";

const API_BASE_URL = "https://provinces.open-api.vn/api/v2";

const wardSchema = z.object({
  name: z.string(),
  code: z.number().int(),
  division_type: z.string(),
  codename: z.string(),
  province_code: z.number().int(),
});

const provinceSchema = z.object({
  name: z.string(),
  code: z.number().int(),
  division_type: z.string(),
  codename: z.string(),
  phone_code: z.number().int().nullish(),
  wards: z.array(wardSchema).default([]),
});

export type VietnamProvince = z.infer<typeof provinceSchema>;
export type VietnamWard = z.infer<typeof wardSchema>;

async function requestJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Không tải được dữ liệu khu vực (${response.status}).`);
  }
  return response.json();
}

export const vietnamAdministrativeService = {
  async listProvinces(signal?: AbortSignal): Promise<VietnamProvince[]> {
    const data = await requestJson(`${API_BASE_URL}/p/`, signal);
    return z.array(provinceSchema).parse(data);
  },

  async getProvince(
    provinceCode: number,
    signal?: AbortSignal,
  ): Promise<VietnamProvince> {
    const data = await requestJson(
      `${API_BASE_URL}/p/${provinceCode}?depth=2`,
      signal,
    );
    return provinceSchema.parse(data);
  },
};
