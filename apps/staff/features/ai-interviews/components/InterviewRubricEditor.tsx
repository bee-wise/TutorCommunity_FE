"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { useInterviewRubricEditor } from "../hooks/useInterviewRubricEditor";
import { rubricConfigSchema } from "../services/rubric-config";
import { InterviewRubricFields } from "./InterviewRubricFields";
import { actionClass, fieldClass, FieldError, panelClass } from "./InterviewUi";

export function InterviewRubricEditor({ content, version, existingVersions, onCreated, onCancel }: {
  content: Record<string, unknown>; version: string; existingVersions: string[]; onCreated: (version: string) => void; onCancel: () => void;
}) {
  const { form, config, mutation, save, exportToml, updateConfig } = useInterviewRubricEditor(content, version, existingVersions, onCreated);
  return <section className={panelClass}><h2 className="text-lg font-bold">Tạo bộ câu hỏi từ {version}</h2>
    <p className="mt-3 text-sm text-muted-foreground">Lưu thành phiên bản mới. Backend kiểm tra đủ Q1–Q6, tổng trọng số bằng 1, thang điểm 0–4 và mã tiêu chí không trùng.</p>
    <form onSubmit={save} className="mt-5"><fieldset disabled={mutation.isPending} className="min-w-0 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Phiên bản rubric mới<input {...form.register("version")} maxLength={50} className={`mt-2 ${fieldClass}`} /></label><label className="block text-sm font-medium">Ghi chú thay đổi<textarea {...form.register("note")} rows={2} maxLength={2000} className={`mt-2 ${fieldClass}`} /></label></div>
      <FieldError message={form.formState.errors.version?.message} /><FieldError message={form.formState.errors.note?.message} />
      {config && <InterviewRubricFields name="Câu hỏi, thời gian và barem" value={config} onChange={(value) => updateConfig(rubricConfigSchema.parse(value))} />}
      <DisclosureCard variant="outline" title="Chỉnh JSON đầy đủ" className="min-w-0"><label className="block text-sm font-medium">Cấu hình JSON<textarea {...form.register("source")} rows={16} spellCheck={false} className={`mt-2 font-mono text-xs ${fieldClass}`} /></label></DisclosureCard>
      <FieldError message={form.formState.errors.source?.message} /><FieldError message={form.formState.errors.root?.message} />
      <div className="flex flex-wrap gap-2"><Button type="submit" className={actionClass}>{mutation.isPending ? "Đang tạo…" : "Tạo phiên bản rubric"}</Button><Button type="button" variant="outline" className={actionClass} onClick={exportToml}><ArrowDownTrayIcon className="size-4" />Xuất TOML</Button><Button type="button" variant="outline" className={actionClass} onClick={onCancel}>Hủy chỉnh sửa</Button></div>
    </fieldset></form>
  </section>;
}
