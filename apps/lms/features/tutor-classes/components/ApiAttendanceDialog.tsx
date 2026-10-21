"use client";

import { useState } from "react";
import { useWatch } from "react-hook-form";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { Avatar, AvatarFallback } from "@workspace/ui/components/ui/avatar";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { useApiAttendance } from "../hooks/useApiAttendance";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { formatClassDate } from "../utils/classes.utils";
import {
  classButton,
  classInput,
  classOutlineButton,
  classPanel,
} from "./classes-ui";

const options = [
  { value: "PRESENT", label: "Có mặt" },
  { value: "ABSENT", label: "Vắng" },
  { value: "UNMARKED", label: "Chưa điểm danh" },
] as const;
export function ApiAttendanceDialog({
  classId,
  classStatus,
  session,
  onClose,
}: {
  classId: string;
  classStatus?: string | null;
  session: ClassSessionDto;
  onClose: () => void;
}) {
  const attendance = useApiAttendance(classId, session, classStatus);
  const [discard, setDiscard] = useState(false);
  const { form } = attendance;
  const pending = attendance.save.isPending;
  const close = () => {
    if (!pending) {
      if (form.formState.isDirty) setDiscard(true);
      else onClose();
    }
  };
  const marks = useWatch({ control: form.control, name: "marks" });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl flex-col overflow-hidden rounded-3xl bg-card p-0">
        <DialogHeader className="border-b border-border p-5 pr-16">
          <DialogTitle>Điểm danh buổi học</DialogTitle>
          <DialogDescription>
            {formatClassDate(session.startAt)} · Danh sách học viên được chốt khi bắt đầu buổi
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 space-y-4 overflow-y-auto p-5">
          {discard ? (
            <div role="alert" className={classPanel}>
              <p>Bạn có thay đổi chưa lưu.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className={classOutlineButton}
                  onClick={onClose}
                >
                  Bỏ thay đổi & đóng
                </Button>
                <Button
                  className={classButton}
                  onClick={() => setDiscard(false)}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          ) : attendance.loading ? (
            <p role="status">Đang tải danh sách học viên và điểm danh...</p>
          ) : attendance.error ? (
            <ClassQueryErrorState
              error={attendance.error}
              onRetry={() => void attendance.reload()}
            />
          ) : (
            <>
              {!attendance.editable && (
                <p
                  role="status"
                  className="rounded-2xl border border-border p-3 text-sm"
                >
                  {attendance.conflict
                    ? "Dữ liệu đã thay đổi. Tải lại phiên bản mới trước khi sửa."
                    : "Chỉ xem. Gia sư có thể sửa trong buổi học và tối đa 12 giờ sau khi buổi kết thúc."}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Phiên bản {attendance.record.data?.version ?? 0}.{" "}
                {attendance.record.data?.status ?? "Chưa lưu"}. Không tự thay
                đổi học phí.
              </p>
              <form
                aria-label="Điểm danh danh sách học viên"
                onSubmit={(e) => e.preventDefault()}
                className="grid gap-4 md:grid-cols-2"
              >
                {marks.map((mark, index) => {
                  const person = attendance.members.data?.find(
                    (m) => m.learnerId === mark.learnerId,
                  );
                  const name = person?.name ?? `Học viên ${index + 1}`;
                  return (
                    <article
                      key={mark.learnerId}
                      className={`${classPanel} min-w-0 space-y-3`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback>
                            {name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="break-all text-sm font-bold">{name}</p>
                      </div>
                      <fieldset disabled={!attendance.editable || pending}>
                        <legend className="sr-only">Điểm danh {name}</legend>
                        <div className="flex flex-wrap gap-2">
                          {options.map((o) => (
                            <label
                              key={o.value}
                              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-3 text-xs has-[:checked]:border-primary has-[:checked]:text-primary"
                            >
                              <input
                                type="radio"
                                value={o.value}
                                {...form.register(`marks.${index}.status`)}
                                className="peer sr-only"
                              />
                              <span className="size-4 rounded-full border-2 border-input peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
                              {o.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      {mark.status === "ABSENT" && (
                        <label className="grid gap-1 text-xs font-bold">
                          Loại vắng (theo quy định lớp)
                          <input
                            className={classInput}
                            {...form.register(`marks.${index}.absenceType`)}
                            disabled={!attendance.editable || pending}
                          />
                        </label>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {(["isLate", "leftEarly"] as const).map((field) => (
                          <label
                            key={field}
                            className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"
                          >
                            <input
                              type="checkbox"
                              {...form.register(`marks.${index}.${field}`)}
                              disabled={!attendance.editable || pending}
                              className="peer sr-only"
                            />
                            <span aria-hidden className="grid size-5 place-items-center rounded-md border-2 border-border bg-card text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50"><CheckIcon className="size-3.5" /></span>
                            {field === "isLate" ? "Đi muộn" : "Rời sớm"}
                          </label>
                        ))}
                      </div>
                      <label className="grid gap-1 text-xs font-bold">
                        Ghi chú
                        <input
                          className={classInput}
                          maxLength={1000}
                          {...form.register(`marks.${index}.note`)}
                          disabled={!attendance.editable || pending}
                        />
                      </label>
                    </article>
                  );
                })}
              </form>
              {!marks.length && <p>Chưa có học viên trong danh sách điểm danh.</p>}
              {Object.keys(form.formState.errors).length > 0 && (
                <p role="alert" className="text-sm text-destructive">
                  Kiểm tra trạng thái và ghi chú điểm danh.
                </p>
              )}
              <section className="space-y-2">
                <h2 className="text-sm font-bold">Lịch sử điểm danh</h2>
                {attendance.history.error ? (
                  <p className="text-sm">Chưa tải được lịch sử.</p>
                ) : (
                  attendance.history.data?.map((h) => (
                    <p
                      key={h.version}
                      className="text-xs text-muted-foreground"
                    >
                      Phiên bản {h.version}: {h.status} ·{" "}
                      {formatClassDate(h.createdAt)}
                    </p>
                  ))
                )}
              </section>
            </>
          )}
        </div>
        {!discard && (
          <DialogFooter className="flex-wrap border-t border-border p-5">
            <Button
              variant="outline"
              className={classOutlineButton}
              disabled={pending}
              onClick={close}
            >
              Đóng
            </Button>
            <Button
              variant="outline"
              className={classOutlineButton}
              disabled={pending}
              onClick={() => void attendance.reload()}
            >
              Tải lại
            </Button>
            {attendance.editable && (
              <>
                <Button
                  variant="outline"
                  className={classOutlineButton}
                  disabled={
                    pending || attendance.record.data?.status === "CONFIRMED"
                  }
                  onClick={() => void attendance.submit("DRAFT")}
                >
                  Lưu nháp
                </Button>
                <Button
                  className={classButton}
                  disabled={pending || !marks.length}
                  onClick={() => void attendance.submit("CONFIRMED")}
                >
                  {pending ? "Đang lưu..." : "Xác nhận điểm danh"}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
