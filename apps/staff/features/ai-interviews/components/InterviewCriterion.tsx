"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import type { InterviewCriterion as Criterion } from "@workspace/core/ai-interviews/schemas/review.schema";
import { useCriterionOverride } from "../hooks/useInterviewActions";
import { actionClass, FieldError, fieldClass } from "./InterviewUi";

export function InterviewCriterion({ criterion, interviewId, canOverride }: { criterion: Criterion; interviewId: string; canOverride: boolean }) {
  const { form, mutation, save } = useCriterionOverride(interviewId, criterion.criterion_code);
  return <article className="rounded-2xl border border-border bg-background p-4">
    <div className="flex flex-wrap justify-between gap-2"><h4 className="text-sm font-bold">{criterion.criterion_code} · {criterion.description}</h4><span className="text-sm font-bold tabular-nums">{criterion.effective_score ?? "Chưa chấm"} / 4</span></div>
    <p className="mt-2 text-xs text-muted-foreground">Điểm AI: {criterion.score ?? "Chưa chấm"} · Trạng thái: {criterion.score_status ?? "Chưa có"} · Trọng số: {Math.round(criterion.weight * 100)}%</p>
    {criterion.override_level != null && <p className="mt-2 text-sm font-medium text-primary">Consultant chấm: {criterion.override_level}/4 · {criterion.override_reason}</p>}
    {criterion.comment && <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{criterion.comment}</p>}
    {criterion.rationale && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{criterion.rationale}</p>}
    {!!criterion.review_reasons.length && <p className="mt-2 text-sm text-warning">Cần xem lại: {criterion.review_reasons.join(", ")}</p>}
    {criterion.evidence.map((item, index) => <blockquote key={`${item.q_code}-${index}`} className="mt-3 rounded-xl bg-muted p-3 text-sm leading-6">“{item.quote}”<p className="mt-1 text-xs text-muted-foreground">{item.q_code} · {item.type}</p></blockquote>)}
    <DisclosureCard variant="subtle" size="sm" title="Barem và điểm Consultant" className="mt-4">
      <ol className="grid gap-2 text-sm">{criterion.levels.map((level, index) => <li key={index}><strong>Mức {index}:</strong> {level}</li>)}</ol>
      {canOverride && <form onSubmit={save} className="mt-4 space-y-3"><fieldset disabled={mutation.isPending} className="space-y-3"><legend className="text-sm font-semibold">Chọn điểm chấm lại</legend><div className="flex flex-wrap gap-2">{[0, 1, 2, 3, 4].map((level) => <label key={level} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm"><input type="radio" value={level} {...form.register("new_level", { valueAsNumber: true })} className="accent-primary" />{level}</label>)}</div><FieldError message={form.formState.errors.new_level?.message} /><label className="block text-sm font-medium">Lý do chấm lại<textarea {...form.register("reason")} rows={3} maxLength={2000} className={`mt-2 ${fieldClass}`} /></label><FieldError message={form.formState.errors.reason?.message} /><Button type="submit" size="sm" className={actionClass}>{mutation.isPending ? "Đang lưu…" : "Lưu điểm Consultant"}</Button></fieldset></form>}
    </DisclosureCard>
  </article>;
}
