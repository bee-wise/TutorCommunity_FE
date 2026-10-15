"use client";
import { useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classSessionsService as service } from "@workspace/core/lms-classes/sessions.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import {
  vietnamTimeToUtc,
  utcToVietnamInput,
} from "@workspace/core/lms-classes/lifecycle";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { tutorClassQueryKeys } from "../query-keys";
import { getTutorClassDetail } from "../services/classes.service";
import { calculateSessionEndAt } from "../utils/session-schedule.utils";
import { useTutorClassAccess } from "./useTutorClassAccess";
const row = z.object({
  start: z.string().min(1),
  meeting: z.string(),
  planned: z.string(),
});
const formSchema = z.object({ slots: z.array(row).min(1).max(100) });
type Values = z.infer<typeof formSchema>;
const empty = { start: "", meeting: "", planned: "" };
const vietnamNow = () => utcToVietnamInput(new Date().toISOString());

export function useSessionScheduler(
  classId: string,
  group: boolean,
  session: ClassSessionDto | undefined,
  numberOfSessions: number,
  sessionCount: number,
  sessionDurationMinutes: number,
  onClose: () => void,
) {
  const queryClient = useQueryClient();
  const access = useTutorClassAccess();
  const [minimumDate, setMinimumDate] = useState(vietnamNow);
  useEffect(() => {
    const timer = window.setInterval(() => setMinimumDate(vietnamNow()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const form = useForm<Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slots: [
        session
          ? {
              start: utcToVietnamInput(session.startAt),
              meeting: session.locationOrMeetingInfo ?? "",
              planned: session.plannedScheduleId ?? "",
            }
          : empty,
      ],
    },
  });
  const rows = useFieldArray({ control: form.control, name: "slots" });
  const planned = useLmsClassResource(classId, "planned", (s) =>
    service.planned(classId, s),
  );
  const preview = useLmsClassCommand(
    classId,
    (slots: Parameters<typeof service.preview>[1]) =>
      service.preview(classId, slots),
  );
  const create = useLmsClassCommand(
    classId,
    (v: Parameters<typeof service.createBatch>[1]) =>
      service.createBatch(classId, v),
  );
  const reschedule = useLmsClassCommand(
    classId,
    (v: Parameters<typeof service.reschedule>[1]) =>
      service.reschedule(session?.id ?? "", v),
  );
  const createPlan = useLmsClassCommand(
    classId,
    (v: Parameters<typeof service.createPlanned>[1]) =>
      service.createPlanned(classId, v),
  );
  const intent = useRef<{ signature: string; key: string } | null>(null);
  const planIds = useRef(new Map<string, string>());
  const [checkedSignature, setCheckedSignature] = useState("");
  const [checkingCapacity, setCheckingCapacity] = useState(false);
  const values = useWatch({ control: form.control });
  const busy =
    checkingCapacity ||
    preview.isPending ||
    create.isPending ||
    createPlan.isPending ||
    reschedule.isPending;
  const signature = JSON.stringify({
    slots: values.slots,
    durationMinutes: sessionDurationMinutes,
  });
  const remainingSlots = Math.max(0, numberOfSessions - sessionCount);

  function derivedEndAt(start: string) {
    if (!start) return null;
    try {
      return calculateSessionEndAt(vietnamTimeToUtc(start), sessionDurationMinutes);
    } catch {
      return null;
    }
  }

  async function ensureCapacity(requested: number) {
    if (!session && requested > remainingSlots)
      throw new Error(`Lớp chỉ còn ${remainingSlots} buổi có thể tạo.`);
    const latest = await queryClient.fetchQuery({
      queryKey: tutorClassQueryKeys.detail(access.actorId, classId),
      queryFn: ({ signal }) => getTutorClassDetail(classId, signal),
      staleTime: 0,
    });
    if (!session) {
      const available = Math.max(0, latest.numberOfSessions - latest.sessionCount);
      if (requested > available)
        throw new Error(`Lớp chỉ còn ${available} buổi có thể tạo. Vui lòng kiểm tra lại.`);
    }
    return latest.sessionDurationMinutes;
  }

  function slots(v: Values, durationMinutes: number) {
    return v.slots.map((s) => {
      const startAt = vietnamTimeToUtc(s.start);
      const endAt = calculateSessionEndAt(startAt, durationMinutes);
      if (Date.parse(startAt) < Date.now())
        throw new Error("Giờ bắt đầu không được ở trong quá khứ.");
      if (Date.parse(endAt) < Date.now())
        throw new Error("Giờ kết thúc không được ở trong quá khứ.");
      if (Date.parse(endAt) <= Date.parse(startAt))
        throw new Error("Giờ kết thúc phải sau giờ bắt đầu.");
      if (group && !s.planned && !session)
        throw new Error("Chọn hoặc tạo lịch dự kiến cho từng buổi GROUP.");
      return {
        startAt,
        endAt,
        locationOrMeetingInfo: s.meeting || null,
        plannedScheduleId: s.planned || null,
      };
    });
  }
  const check = form.handleSubmit(async (v) => {
    setCheckedSignature("");
    setCheckingCapacity(true);
    try {
      const durationMinutes = await ensureCapacity(v.slots.length);
      const input = slots(v, durationMinutes);
      await preview.mutateAsync(input);
      setCheckedSignature(JSON.stringify({
        slots: v.slots,
        durationMinutes,
      }));
    } catch (e) {
      toast.error("Chưa xem trước được lịch", {
        description:
          e instanceof Error && !("statusCode" in e)
            ? e.message
            : "Kiểm tra quyền, trạng thái lớp và lịch dự kiến.",
      });
    } finally {
      setCheckingCapacity(false);
    }
  }, () => toast.error("Chọn giờ bắt đầu cho từng buổi."));
  const submit = (event?: BaseSyntheticEvent) =>
    form.handleSubmit(async (v) => {
      if (
        busy || preview.isError ||
        checkedSignature !== JSON.stringify({
          slots: v.slots,
          durationMinutes: sessionDurationMinutes,
        }) ||
        preview.data?.conflicts.length
      )
        return;
      setCheckingCapacity(true);
      try {
        const durationMinutes = await ensureCapacity(v.slots.length);
        if (durationMinutes !== sessionDurationMinutes)
          throw new Error("Thời lượng buổi học đã thay đổi. Xem trước lại lịch.");
        const input = slots(v, durationMinutes);
        if (session) {
          const result = await reschedule.mutateAsync(input[0]);
          if (result.conflicts.length) {
            toast.error("Lịch đã phát sinh xung đột. Xem trước lại.");
            setCheckedSignature("");
            return;
          }
        } else {
          if (
            !intent.current ||
            intent.current.signature !== JSON.stringify(input)
          )
            intent.current = {
              signature: JSON.stringify(input),
              key: crypto.randomUUID(),
            };
          const result = await create.mutateAsync({
            sessions: input,
            submitKey: intent.current.key,
          });
          if (result.conflicts.length) {
            toast.error("Lịch đã phát sinh xung đột. Xem trước lại.");
            setCheckedSignature("");
            return;
          }
        }
        toast.success(session ? "Đã đổi lịch" : "Đã tạo buổi học");
        onClose();
      } catch (e) {
        setCheckedSignature("");
        toast.error("Chưa lưu được lịch", {
          description:
            e instanceof Error && !("statusCode" in e)
              ? e.message
              : "Giữ nguyên nội dung để thử lại cùng khóa. Tải lại khi xung đột phiên bản.",
        });
      } finally {
        setCheckingCapacity(false);
      }
    })(event);
  async function createPlanned(index: number) {
    setCheckingCapacity(true);
    try {
      const value = form.getValues(`slots.${index}`);
      const startAt = vietnamTimeToUtc(value.start);
      const durationMinutes = await ensureCapacity(rows.fields.length);
      const endAt = calculateSessionEndAt(startAt, durationMinutes);
      if (Date.parse(startAt) < Date.now())
        throw new Error("Giờ bắt đầu không được ở trong quá khứ.");
      if (Date.parse(endAt) <= Date.parse(startAt))
        throw new Error("Giờ kết thúc phải sau giờ bắt đầu.");
      const key = JSON.stringify({ index, startAt, endAt });
      if (!planIds.current.has(key))
        planIds.current.set(key, crypto.randomUUID());
      const result = await createPlan.mutateAsync({
        id: planIds.current.get(key)!,
        startAt,
        endAt,
        timeZoneId: "Asia/Ho_Chi_Minh",
      });
      form.setValue(`slots.${index}.planned`, result.id, { shouldDirty: true });
      toast.success("Đã tạo lịch dự kiến");
    } catch (e) {
      toast.error("Chưa tạo được lịch dự kiến", {
        description: e instanceof Error && !("statusCode" in e) ? e.message : undefined,
      });
    } finally {
      setCheckingCapacity(false);
    }
  }

  return {
    form,
    rows,
    planned,
    preview,
    values,
    derivedEndAt,
    minimumDate,
    remainingSlots,
    busy,
    signature,
    checkedSignature,
    createPlanned,
    check,
    submit,
    empty,
  };
}
