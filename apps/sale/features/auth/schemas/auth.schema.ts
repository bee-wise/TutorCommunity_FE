import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Họ không được để trống")
      .max(100, "Họ không được vượt quá 100 ký tự"),
    lastName: z
      .string()
      .trim()
      .min(1, "Tên không được để trống")
      .max(100, "Tên không được vượt quá 100 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ")
      .max(255, "Email không được vượt quá 255 ký tự"),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Số điện thoại không được để trống")
      .max(20, "Số điện thoại không được vượt quá 20 ký tự")
      .regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(128, "Mật khẩu không được vượt quá 128 ký tự"),
    confirmPassword: z
      .string()
      .min(1, "Xác nhận mật khẩu không được để trống"),
    role: z.enum(["LEARNER", "TUTOR"], {
      error: "Vui lòng chọn vai trò",
    }),
    agreeTerms: z
      .boolean()
      .refine((value) => value === true, "Bạn phải đồng ý với điều khoản sử dụng"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
