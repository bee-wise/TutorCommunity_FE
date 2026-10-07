"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { attendanceCommandSchema, attendanceFormSchema, type AttendanceFormValues } from "../types/attendance.schemas";
import type { ClassLearner, SessionAttendance, TutorClass, TutorClassSession } from "../types/classes.types";
import { useAttendanceStore } from "../store/attendance.store";
import { canMarkAttendance } from "../utils/classes.utils";

export function useAttendanceForm(classInfo: TutorClass, session: TutorClassSession, learners: ClassLearner[], record?: SessionAttendance) {
  const save = useAttendanceStore((state) => state.save);
  const [version, setVersion] = useState(record?.version ?? 0);
  const editable = canMarkAttendance(classInfo, session);
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: { entries: learners.map((learner) => record?.entries.find((entry) => entry.learnerId === learner.id) ?? { learnerId: learner.id, status: "unmarked", note: "" }) },
  });
  const submit = (state: "draft" | "confirmed") => form.handleSubmit((values) => {
    if (!editable) return;
    const parsed = attendanceCommandSchema.safeParse({ classId: classInfo.id, sessionId: session.id, expectedVersion: version, state, entries: values.entries });
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const index = issue.path[1];
        const field = issue.path[2];
        if (typeof index === "number" && (field === "status" || field === "note")) form.setError(`entries.${index}.${field}`, { message: issue.message });
      });
      toast.error("Chưa thể xác nhận", { description: "Kiểm tra trạng thái và ghi chú của từng học viên." });
      return;
    }
    try {
      const saved = save(parsed.data);
      setVersion(saved.version);
      form.reset({ entries: saved.entries });
      toast.success(state === "confirmed" ? "Đã xác nhận điểm danh (mock)" : "Đã lưu bản nháp (mock)", { description: "Chỉ lưu trong phiên hiện tại, chưa gửi BE." });
    } catch (error) {
      toast.error("Chưa lưu được điểm danh", { description: error instanceof Error ? error.message : "Vui lòng thử lại." });
    }
  });
  function markAllPresent() {
    if (!editable) return;
    learners.forEach((_, index) => form.setValue(`entries.${index}.status`, "present", { shouldDirty: true }));
    form.clearErrors();
  }
  return { form, editable, submit, markAllPresent };
}
