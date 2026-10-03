import { z } from "zod";
import type { MeType } from "@workspace/core/types/auth.type";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên cần ít nhất 2 ký tự.").max(80, "Họ tên tối đa 80 ký tự."),
  phoneNumber: z.string().trim().refine((value) => !value || /^(0|\+84)[0-9]{9}$/.test(value), "Nhập số điện thoại Việt Nam hợp lệ."),
  location: z.string().trim().max(100, "Địa điểm tối đa 100 ký tự."),
  birthday: z.string().refine((value) => !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).getTime() <= Date.now()), "Ngày sinh phải là ngày hợp lệ trong quá khứ."),
  bio: z.string().trim().max(300, "Giới thiệu tối đa 300 ký tự."),
});

export type ProfileValues = z.infer<typeof profileSchema>;
export type ProfileTab = "profile" | "security" | "notifications";
export type NotificationKey = "messages" | "reminders" | "email" | "updates";
export type NotificationPreferences = Record<NotificationKey, boolean>;
export const interestOptions = ["Toán học", "Tiếng Anh", "Ngữ văn", "Vật lý", "Hóa học", "Sinh học", "Tin học", "Kỹ năng mềm"];

export function getProfileValues(user: MeType): ProfileValues {
  return {
    fullName: user.fullName?.trim() || user.displayName?.trim() || [user.lastName, user.firstName].filter(Boolean).join(" ").trim(),
    phoneNumber: user.phoneNumber || "",
    location: "", birthday: "", bio: "",
  };
}

export function getRoleLabel(role: string | null) {
  const labels: Record<string, string> = { LEARNER: "Học viên", TUTOR: "Gia sư", CONSULTANT: "Tư vấn viên", ADMIN: "Quản trị viên" };
  return labels[role?.trim().toUpperCase() || ""] || "Thành viên";
}

export function getInitials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(-2).map((word) => word[0]).join("").toUpperCase() || "BW";
}

export function formatBirthday(value: string) {
  if (!value) return "Chưa cập nhật";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
