"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AIAnalyzeResponse } from "../types";
import { AIAnalyzeResponseSchema } from "../types/material.schemas";
import { SummaryEditorFields } from "./SummaryEditorFields";
import { QuizEditorFields } from "./QuizEditorFields";
import { actionClass, outlineActionClass } from "./materials-ui";

export function DocumentEditor({ data, onSave, onCancel }: { data: AIAnalyzeResponse; onSave: (data: AIAnalyzeResponse) => void; onCancel: () => void }) {
  const form = useForm<AIAnalyzeResponse>({ resolver: zodResolver(AIAnalyzeResponseSchema), defaultValues: data });
  return <FormProvider {...form}><form onSubmit={form.handleSubmit(onSave)} className="space-y-8"><p className="text-sm text-muted-foreground">Chỉnh sửa nội dung và công thức LaTeX. Lưu thay đổi thành bản nháp trước khi xuất bản.</p><SummaryEditorFields /><QuizEditorFields />{!form.formState.isValid && form.formState.submitCount > 0 && <p role="alert" className="text-sm text-destructive">Kiểm tra các trường còn thiếu hoặc đáp án không hợp lệ trước khi lưu.</p>}<div className="flex flex-wrap gap-3"><button type="submit" className={actionClass}>Lưu bản nháp</button><button type="button" className={outlineActionClass} onClick={onCancel}>Hủy chỉnh sửa</button></div></form></FormProvider>;
}
