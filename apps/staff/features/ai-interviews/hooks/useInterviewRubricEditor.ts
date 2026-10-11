"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useStaffInterviewMutation } from "./useInterviewActions";
import { downloadRubricToml, parseRubricConfig, prepareRubricVersion, serializeRubricToml, type RubricConfig } from "../services/rubric-config";

const editorSchema = z.object({
  version: z.string().trim().min(1, "Nhập phiên bản mới.").max(50),
  note: z.string().trim().max(2000),
  source: z.string().min(1).refine((value) => {
    try { parseRubricConfig(value); return true; } catch { return false; }
  }, "Cấu hình phải là object JSON gồm văn bản, số, boolean, mảng hoặc object; TOML không hỗ trợ null."),
});
type EditorValues = z.infer<typeof editorSchema>;

export function useInterviewRubricEditor(content: Record<string, unknown>, currentVersion: string, existingVersions: string[], onCreated: (version: string) => void) {
  const form = useForm<EditorValues>({ resolver: zodResolver(editorSchema), defaultValues: { version: "", note: "", source: JSON.stringify(content, null, 2) } });
  const source = useWatch({ control: form.control, name: "source" });
  let config: RubricConfig | null = null;
  try { config = parseRubricConfig(source); } catch { /* The JSON editor remains available to correct unsupported values. */ }
  const mutation = useStaffInterviewMutation(({ file, note }: { file: File; note: string }) => interviewApi.uploadRubric(file, note), "Đã tạo bộ câu hỏi mới. Chọn Áp dụng để sử dụng.");
  const save = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    try {
      const next = prepareRubricVersion(parseRubricConfig(values.source), currentVersion, values.version, existingVersions);
      const file = new File([serializeRubricToml(next)], "rubric.toml", { type: "application/toml" });
      const result = await mutation.mutateAsync({ file, note: values.note });
      onCreated(result.version);
    } catch (error) { form.setError("root", { message: getApiErrorMessage(error) }); }
  });
  const exportToml = () => {
    try {
      const values = form.getValues();
      const original = parseRubricConfig(values.source);
      const next = values.version.trim() ? prepareRubricVersion(original, currentVersion, values.version, existingVersions) : original;
      downloadRubricToml(next, values.version.trim() || currentVersion);
      form.clearErrors("root");
    } catch (error) { form.setError("root", { message: getApiErrorMessage(error) }); }
  };
  return { form, config, mutation, save, exportToml, updateConfig: (next: RubricConfig) => form.setValue("source", JSON.stringify(next, null, 2), { shouldDirty: true, shouldValidate: true }) };
}

export function useInterviewRubricExport(content: Record<string, unknown> | undefined, version: string) {
  return () => {
    if (!content) return;
    try { downloadRubricToml(parseRubricConfig(JSON.stringify(content)), version); }
    catch (error) { toast.error(getApiErrorMessage(error)); }
  };
}
