import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Họ không được để trống")
      .max(50, "Họ không được vượt quá 50 ký tự"),
    lastName: z
      .string()
      .min(1, "Tên không được để trống")
      .max(50, "Tên không được vượt quá 50 ký tự"),
    email: z.email("Email không hợp lệ").min(1, "Email không được để trống"),
    phoneNumber: z
      .string()
      .min(1, "Số điện thoại không được để trống")
      .regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(64, "Mật khẩu không được vượt quá 64 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
    role: z.enum(["learner", "tutor"], {
      error: "Vui lòng chọn vai trò",
    }),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "Bạn phải đồng ý với điều khoản sử dụng"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
