"use client";
import { useEffect, useState } from "react";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { Button } from "@workspace/ui/components/ui/button";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { formatClassDate } from "../utils/classes.utils";
import {
  classButton,
  classInput,
  classOutlineButton,
  classPanel,
} from "./classes-ui";
import { useSessionScheduler } from "../hooks/useSessionScheduler";
export function SessionSchedulerDialog({
  classId,
  group,
  session,
  numberOfSessions,
  sessionCount,
  sessionDurationMinutes,
  onClose,
}: {
  classId: string;
  group: boolean;
  session?: ClassSessionDto;
  numberOfSessions: number;
  sessionCount: number;
  sessionDurationMinutes: number;
  onClose: () => void;
}) {
  const {
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
  } = useSessionScheduler(
    classId,
    group,
    session,
    numberOfSessions,
    sessionCount,
    sessionDurationMinutes,
    onClose,
  );
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [pickerSide, setPickerSide] = useState<"right" | "bottom">("bottom");

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const updateSide = () => setPickerSide(media.matches ? "right" : "bottom");
    updateSide();
    media.addEventListener("change", updateSide);
    return () => media.removeEventListener("change", updateSide);
  }, []);

  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v && !busy) onClose();
      }}
    >
      <DialogContent
        ref={setPortalContainer}
        className="flex max-h-[90dvh] max-w-3xl flex-col overflow-visible rounded-3xl p-0"
      >
        <DialogHeader className="border-b border-border p-5 pr-16">
          <DialogTitle>
            {session ? "Đổi lịch buổi học" : "Tạo buổi học"}
          </DialogTitle>
          <DialogDescription>
            {session
              ? "Chọn giờ bắt đầu (UTC+7); giờ kết thúc tự tính theo thời lượng lớp."
              : "Chọn giờ bắt đầu (UTC+7); giờ kết thúc tự tính theo thời lượng lớp. Lịch dự kiến và roadmap không tự tạo buổi học."}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 space-y-4 overflow-y-auto p-5">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {rows.fields.map((field, index) => {
              const endAt = derivedEndAt(values.slots?.[index]?.start ?? "");
              return (
                <fieldset
                  key={field.id}
                  disabled={busy}
                  className={`${classPanel} space-y-3`}
                >
                  <legend className="px-2 text-sm font-bold">
                    Buổi {index + 1}
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DateTimePicker
                      id={`session-${index}-start`}
                      label="Bắt đầu"
                      value={values.slots?.[index]?.start ?? ""}
                      onChange={(value) =>
                        form.setValue(`slots.${index}.start`, value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      minDate={minimumDate}
                      disabled={busy}
                      portalContainer={portalContainer}
                      side={pickerSide}
                    />
                    <div className="grid gap-1">
                      <span className="text-xs font-semibold text-foreground">
                        Kết thúc tự động
                      </span>
                      <output
                        htmlFor={`session-${index}-start`}
                        aria-live="polite"
                        className="flex min-h-10 items-center rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground"
                      >
                        {endAt
                          ? formatClassDate(endAt)
                          : sessionDurationMinutes <= 0
                            ? "Thời lượng buổi học chưa hợp lệ"
                            : "Chọn giờ bắt đầu"}
                      </output>
                      <span className="text-xs text-muted-foreground">
                        Theo thời lượng {sessionDurationMinutes} phút của lớp
                      </span>
                    </div>
                  </div>
                  {!session && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-xs font-bold">
                        Tên buổi học (tùy chọn)
                        <input
                          placeholder="Ví dụ: Buổi 1 - Nhập môn"
                          maxLength={200}
                          className={classInput}
                          {...form.register(`slots.${index}.name`)}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-bold">
                        Mô tả buổi học (tùy chọn)
                        <textarea
                          placeholder="Nội dung kiến thức, tài liệu..."
                          maxLength={2000}
                          rows={1}
                          className="min-h-11 w-full min-w-0 resize-y rounded-2xl border border-input bg-card px-3 py-2 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 sm:text-sm"
                          {...form.register(`slots.${index}.description`)}
                        />
                      </label>
                    </div>
                  )}
                  <label className="grid gap-1 text-xs font-bold">
                    Địa điểm hoặc phòng học
                    <input
                      className={classInput}
                      {...form.register(`slots.${index}.meeting`)}
                    />
                  </label>
                  {group && !session && (
                    <div className="grid gap-2">
                      <label className="grid gap-1 text-xs font-bold">
                        Lịch dự kiến
                        <ClassFilterSelect
                          value={values.slots?.[index]?.planned || "none"}
                          onValueChange={(v) =>
                            form.setValue(
                              `slots.${index}.planned`,
                              v === "none" ? "" : v,
                            )
                          }
                          options={[
                            {
                              value: "none",
                              label: planned.loading
                                ? "Đang tải..."
                                : "Chọn lịch dự kiến",
                            },
                            ...(planned.data ?? [])
                              .filter((p) => p.status !== "CANCELLED")
                              .map((p) => ({
                                value: p.id,
                                label: formatClassDate(p.startAt),
                              })),
                          ]}
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        className={classOutlineButton}
                        onClick={() => void createPlanned(index)}
                      >
                        Tạo lịch dự kiến theo giờ đã nhập
                      </Button>
                    </div>
                  )}
                  {!session && rows.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className={classOutlineButton}
                      onClick={() => rows.remove(index)}
                    >
                      Bỏ buổi này
                    </Button>
                  )}
                </fieldset>
              );
            })}
          </form>
          {!session && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className={classOutlineButton}
                disabled={busy || rows.fields.length >= remainingSlots}
                onClick={() => rows.append({ ...empty })}
              >
                Thêm buổi
              </Button>
              <span
                aria-live="polite"
                className="text-xs font-semibold text-muted-foreground"
              >
                Sau khi tạo: {sessionCount + rows.fields.length}/
                {numberOfSessions} buổi học
              </span>
            </div>
          )}
          {checkedSignature === signature && preview.data && (
            <section aria-label="Kết quả kiểm tra lịch" className={classPanel}>
              {preview.data.conflicts.length ? (
                <>
                  <p className="font-bold text-destructive">
                    Có {preview.data.conflicts.length} xung đột
                  </p>
                  {preview.data.conflicts.map((c, i) => (
                    <p key={i} className="text-sm">
                      Buổi {c.candidateIndex + 1}:{" "}
                      {formatClassDate(c.existingStartAt)} ({c.source})
                    </p>
                  ))}
                </>
              ) : (
                <p>Lịch không có xung đột tại thời điểm kiểm tra.</p>
              )}
            </section>
          )}
        </div>
        <DialogFooter className="flex-wrap border-t border-border p-5">
          <Button
            variant="outline"
            className={classOutlineButton}
            disabled={busy}
            onClick={onClose}
          >
            Đóng
          </Button>
          <Button
            variant="outline"
            className={classOutlineButton}
            disabled={busy}
            onClick={() => void check()}
          >
            Xem trước
          </Button>
          <Button
            className={classButton}
            disabled={
              busy ||
              checkedSignature !== signature ||
              !preview.data ||
              Boolean(preview.data.conflicts.length)
            }
            onClick={() => void submit()}
          >
            {busy
              ? "Đang xử lý..."
              : session
                ? "Xác nhận đổi lịch"
                : "Tạo các buổi học"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
