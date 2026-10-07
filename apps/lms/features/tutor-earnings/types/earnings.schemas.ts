import { z } from "zod";

export const reportIssueSchema = z.object({
  title: z.string().trim().min(1, "Chọn vấn đề cần hỗ trợ.").max(120),
  description: z
    .string()
    .trim()
    .min(10, "Mô tả cần ít nhất 10 ký tự, không tính khoảng trắng đầu/cuối.")
    .max(2000, "Mô tả không quá 2.000 ký tự."),
});

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;
