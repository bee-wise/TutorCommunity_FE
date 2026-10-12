"use client";

import { Controller } from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import { useCriterionOverride } from "../hooks/useInterviewActions";
import { actionClass, FieldError, fieldClass } from "./InterviewUi";

export function InterviewCriterionOverride({
  interviewId,
  code,
}: {
  interviewId: string;
  code: string;
}) {
  const { form, mutation, save } = useCriterionOverride(interviewId, code);
  return (
    <form onSubmit={save} className="mt-5">
      <fieldset disabled={mutation.isPending} className="space-y-3">
        <legend className="mb-3 text-sm font-bold">Chọn điểm chấm lại</legend>
        <Controller
          control={form.control}
          name="new_level"
          render={({ field }) => (
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((level) => (
                <label key={level} className="cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    value={level}
                    checked={field.value === level}
                    onChange={() => field.onChange(level)}
                    onBlur={field.onBlur}
                    ref={level === 0 ? field.ref : undefined}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-bold transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:opacity-50 active:scale-95">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={form.formState.errors.new_level?.message} />
        <label className="block text-sm font-medium">
          Lý do chấm lại
          <textarea
            {...form.register("reason")}
            rows={3}
            maxLength={2000}
            className={`mt-2 ${fieldClass}`}
          />
        </label>
        <FieldError message={form.formState.errors.reason?.message} />
        <Button type="submit" className={actionClass}>
          {mutation.isPending ? "Đang lưu…" : "Lưu điểm Consultant"}
        </Button>
      </fieldset>
    </form>
  );
}
