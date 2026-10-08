"use client";

import type { UseFormReturn } from "react-hook-form";
import type { AttendanceFormValues } from "../types/attendance.schemas";
import { ATTENDANCE_LABELS, type AttendanceStatus, type ClassLearner } from "../types/classes.types";
import { ClassLearnerIdentity } from "./ClassLearnerIdentity";
import { classInput, classLabel } from "./classes-ui";

const STATUS_OPTIONS: readonly AttendanceStatus[] = ["present", "absent", "unmarked"];

interface AttendanceLearnerCardProps {
  learner: ClassLearner;
  index: number;
  form: UseFormReturn<AttendanceFormValues>;
  editable: boolean;
}

export function AttendanceLearnerCard({ learner, index, form, editable }: AttendanceLearnerCardProps) {
  const statusError = form.formState.errors.entries?.[index]?.status?.message;
  const noteError = form.formState.errors.entries?.[index]?.note?.message;
  const entry = form.getValues(`entries.${index}`);
  const id = `attendance-${learner.id}`;
  const pending = form.formState.isSubmitting;

  return (
    <article aria-labelledby={`${id}-name`} className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4">
      <ClassLearnerIdentity learner={learner} nameId={`${id}-name`} />
      {editable ? (
        <fieldset aria-describedby={statusError ? `${id}-status-error` : undefined}>
          <legend className={`${classLabel} mb-2`}>Điểm danh<span className="sr-only"> {learner.fullName}</span></legend>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <label key={status} className="group flex min-h-11 flex-1 cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-xl border border-border px-3 py-2 transition-all active:scale-[0.98] has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 motion-reduce:transition-none">
                <input type="radio" value={status} defaultChecked={entry?.status === status}
                  {...form.register(`entries.${index}.status`, { onChange: () => form.clearErrors(`entries.${index}.status`) })}
                  className="peer sr-only" disabled={pending} aria-describedby={statusError ? `${id}-status-error` : undefined} />
                <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-input bg-card transition-all peer-checked:border-primary peer-checked:[&>span]:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 motion-reduce:transition-none">
                  <span className="size-2 scale-0 rounded-full bg-primary transition-transform duration-150 motion-reduce:transition-none" />
                </span>
                <span className="text-xs font-medium text-foreground peer-checked:font-bold peer-checked:text-primary">{ATTENDANCE_LABELS[status]}</span>
              </label>
            ))}
          </div>
          {statusError && <p id={`${id}-status-error`} role="alert" className="mt-2 text-xs text-destructive">{statusError}</p>}
        </fieldset>
      ) : (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${(entry?.status ?? "unmarked") === "present" ? "border-secondary/30 bg-secondary/10 text-foreground/80" : entry?.status === "absent" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-muted/40 text-muted-foreground"}`}>{ATTENDANCE_LABELS[entry?.status ?? "unmarked"]}</span>
      )}
      {editable ? (
        <div className="space-y-2">
          <label htmlFor={`${id}-note`} className={classLabel}>Ghi chú <span className="font-normal text-muted-foreground">(không bắt buộc)</span></label>
          <input id={`${id}-note`} type="text" {...form.register(`entries.${index}.note`)} disabled={pending} maxLength={500} placeholder="Thêm ghi chú cho học viên…"
            className={classInput} aria-invalid={Boolean(noteError)} aria-describedby={noteError ? `${id}-note-error` : undefined} />
          {noteError && <p id={`${id}-note-error`} role="alert" className="text-xs text-destructive">{noteError}</p>}
        </div>
      ) : <p className="text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">Ghi chú: {entry?.note || "Không có"}</p>}
    </article>
  );
}
