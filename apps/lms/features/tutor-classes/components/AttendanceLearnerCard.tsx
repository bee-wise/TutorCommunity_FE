"use client";

import type { UseFormReturn } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { inputClass } from "@/components/lms-page-ui";
import type { AttendanceFormValues } from "../types/attendance.schemas";
import { ATTENDANCE_LABELS, type AttendanceStatus, type ClassLearner } from "../types/classes.types";

const STATUS_OPTIONS: readonly AttendanceStatus[] = ["present", "unmarked"];

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
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3.5 text-center text-xs font-bold text-muted-foreground">
        {index + 1}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0" aria-hidden="true">
            {learner.avatarUrl && <AvatarImage src={learner.avatarUrl} alt="" className="object-cover" referrerPolicy="no-referrer" />}
            <AvatarFallback className="bg-primary/10 font-nunito text-xs font-extrabold text-primary">{learner.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p id={`${id}-name`} className="truncate font-nunito text-sm font-bold text-primary">{learner.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{learner.email ?? "Chưa có email"}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        {editable ? (
          <div>
            <div className="flex items-center gap-4">
              {STATUS_OPTIONS.map((status) => (
                <label key={status} className="group inline-flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="radio"
                    value={status}
                    {...form.register(`entries.${index}.status`, {
                      onChange: () => form.clearErrors(`entries.${index}.status`),
                    })}
                    className="peer sr-only"
                    disabled={pending}
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-input bg-card transition-all peer-checked:border-primary peer-checked:[&>span]:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
                  >
                    <span className="size-2 scale-0 rounded-full bg-primary transition-transform duration-150" />
                  </span>
                  <span className="text-xs font-medium text-foreground transition-colors peer-checked:font-bold peer-checked:text-primary">
                    {ATTENDANCE_LABELS[status]}
                  </span>
                </label>
              ))}
            </div>
            {statusError && <p role="alert" className="mt-1 text-xs text-destructive">{statusError}</p>}
          </div>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
              (entry?.status ?? "unmarked") === "present"
                ? "border border-secondary/30 bg-secondary/10 text-secondary"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${
                (entry?.status ?? "unmarked") === "present" ? "bg-secondary" : "bg-muted-foreground"
              }`}
            />
            {ATTENDANCE_LABELS[entry?.status ?? "unmarked"]}
          </span>
        )}
      </td>
      <td className="px-4 py-3.5">
        {editable ? (
          <div>
            <input
              type="text"
              {...form.register(`entries.${index}.note`)}
              disabled={pending}
              maxLength={500}
              placeholder="Ghi chú nếu có..."
              className={`${inputClass} h-9 text-xs disabled:opacity-60`}
            />
            {noteError && <p role="alert" className="mt-1 text-xs text-destructive">{noteError}</p>}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            {entry?.note ? entry.note : "—"}
          </span>
        )}
      </td>
    </tr>
  );
}
