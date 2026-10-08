import { z } from "zod";

export const attendanceEntrySchema = z.object({
  learnerId: z.string().min(1),
  status: z.enum(["unmarked", "present", "absent"]),
  note: z.string().trim().max(500, "Ghi chú không quá 500 ký tự."),
}).strict();
export const attendanceFormSchema = z.object({ entries: z.array(attendanceEntrySchema).min(1) });
export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export const attendanceCommandSchema = z.object({
  classId: z.string().min(1), sessionId: z.string().min(1),
  expectedVersion: z.number().int().nonnegative(), state: z.enum(["draft", "confirmed"]),
  entries: z.array(attendanceEntrySchema).min(1),
}).strict().superRefine((data, context) => {
  if (new Set(data.entries.map((entry) => entry.learnerId)).size !== data.entries.length) {
    context.addIssue({ code: "custom", path: ["entries"], message: "Danh sách học viên bị trùng." });
  }
});
export type AttendanceCommand = z.infer<typeof attendanceCommandSchema>;
