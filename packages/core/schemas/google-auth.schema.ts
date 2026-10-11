import { z } from "zod";

export const googleChallengeSchema = z.object({
  nonce: z.string().min(1),
  expiresAt: z.string().refine((value) => Number.isFinite(Date.parse(value))),
});

export const googleExchangeSchema = z.object({
  status: z.enum(["AUTHENTICATED", "REGISTRATION_REQUIRED", "LINK_REQUIRED"]),
  email: z.string().email().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
});

export const googleRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, "Vui lòng nhập tên").max(100),
  lastName: z.string().trim().min(1, "Vui lòng nhập họ").max(100),
  phoneNumber: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
  role: z.enum(["LEARNER", "TUTOR"], { error: "Vui lòng chọn vai trò" }),
  agreeTerms: z.literal(true, { error: "Bạn cần đồng ý với điều khoản" }),
});

export const googleLinkSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu BeeWise"),
  agreeLink: z.literal(true, { error: "Bạn cần xác nhận liên kết tài khoản" }),
});

export type GoogleRegistrationRequest = z.infer<typeof googleRegistrationSchema>;
export type GoogleLinkRequest = z.infer<typeof googleLinkSchema>;
export type GoogleChallengeData = z.infer<typeof googleChallengeSchema>;
export type GoogleExchangeData = z.infer<typeof googleExchangeSchema>;
