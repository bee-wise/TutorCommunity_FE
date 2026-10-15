"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classSessionsService as service } from "@workspace/core/lms-classes/sessions.service";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import {
  attendanceCommandSchema,
  type ClassSessionDto,
} from "@workspace/core/lms-classes/schemas";
import { canEditClassAttendance } from "@workspace/core/lms-classes/lifecycle";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";

export function useApiAttendance(
  classId: string,
  session: ClassSessionDto,
  classStatus?: string | null,
) {
  const [now, setNow] = useState(() => Date.now());
  const [conflict, setConflict] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 10_000);
    return () => window.clearInterval(timer);
  }, []);
  const roster = useLmsClassResource(
    classId,
    "roster",
    (s) => service.roster(session.id, s),
    { params: [session.id] },
  );
  const record = useLmsClassResource(
    classId,
    "attendance",
    (s) => service.attendance(session.id, s),
    { params: [session.id] },
  );
  const history = useLmsClassResource(
    classId,
    "attendance-history",
    (s) => service.history(session.id, s),
    { params: [session.id] },
  );
  const members = useLmsClassResource(classId, "members-history", (s) =>
    classMembersService.history(classId, s),
  );
  const freshSession = useLmsClassResource(
    classId,
    "session",
    (s) => service.detail(classId, session.id, s),
    { params: [session.id] },
  );
  const form = useForm<z.infer<typeof attendanceCommandSchema>>({
    resolver: zodResolver(attendanceCommandSchema),
    defaultValues: { expectedVersion: 0, status: "DRAFT", marks: [] },
  });
  const save = useLmsClassCommand(
    classId,
    (input: z.infer<typeof attendanceCommandSchema>) =>
      service.saveAttendance(session.id, input),
  );
  useEffect(() => {
    const data = record.data;
    if (roster.data && data && !form.formState.isDirty && !conflict)
      form.reset({
        expectedVersion: data.version,
        status: data.status === "CONFIRMED" ? "CONFIRMED" : "DRAFT",
        marks: roster.data.map(
          (person) =>
            data.marks.find((m) => m.learnerId === person.learnerId) ?? {
              learnerId: person.learnerId,
              status: "UNMARKED",
              absenceType: null,
              note: "",
              isLate: false,
              leftEarly: false,
            },
        ),
      });
  }, [roster.data, record.data, form, form.formState.isDirty, conflict]);
  const error = roster.error ?? record.error ?? freshSession.error;
  const editable =
    !error &&
    !conflict &&
    Boolean(record.data && roster.data && freshSession.data) &&
    canEditClassAttendance(classStatus, freshSession.data ?? session, now);
  const submit = (status: "DRAFT" | "CONFIRMED") => {
    form.setValue("status", status);
    return form.handleSubmit(async (values) => {
      if (!editable || save.isPending) return;
      if (
        values.marks.length !== roster.data?.length ||
        new Set(values.marks.map((m) => m.learnerId)).size !==
          values.marks.length ||
        values.marks.some(
          (mark) =>
            !roster.data?.some((person) => person.learnerId === mark.learnerId),
        )
      )
        return;
      try {
        const result = await save.mutateAsync({
          ...values,
          marks: values.marks.map((mark) => ({
            ...mark,
            absenceType: mark.status === "ABSENT" ? mark.absenceType : null,
          })),
        });
        form.reset({
          expectedVersion: result.version,
          status: result.status === "CONFIRMED" ? "CONFIRMED" : "DRAFT",
          marks: result.marks,
        });
        toast.success("Đã lưu điểm danh");
      } catch (e) {
        if (handleApiError(e).statusCode === 409) setConflict(true);
        toast.error("Chưa lưu được điểm danh", {
          description:
            "Tải lại khi dữ liệu thay đổi hoặc quyền sửa đã hết hạn.",
        });
      }
    })();
  };
  return {
    form,
    roster,
    record,
    history,
    members,
    save,
    editable,
    conflict,
    error,
    loading: roster.loading || record.loading || freshSession.loading,
    async reload() {
      const [freshRoster, freshRecord] = await Promise.all([
        roster.refetch(),
        record.refetch(),
        freshSession.refetch(),
      ]);
      if (freshRoster.data && freshRecord.data) {
        const data = freshRecord.data;
        setConflict(false);
        form.reset({
          expectedVersion: data.version,
          status: data.status === "CONFIRMED" ? "CONFIRMED" : "DRAFT",
          marks: freshRoster.data.map(
            (person) =>
              data.marks.find(
                (mark) => mark.learnerId === person.learnerId,
              ) ?? {
                learnerId: person.learnerId,
                status: "UNMARKED",
                absenceType: null,
                note: "",
                isLate: false,
                leftEarly: false,
              },
          ),
        });
      }
    },
    submit,
  };
}
