"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { interviewKeys } from "@workspace/core/ai-interviews/queryKeys";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { attemptGrantRequestSchema, decisionRequestSchema, overrideRequestSchema, type DecisionRequest, type OverrideRequest, type AttemptGrantRequest } from "@workspace/core/ai-interviews/schemas/review.schema";
import { policyRequestSchema, type PolicyRequest } from "@workspace/core/ai-interviews/schemas/admin.schema";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";

export function useStaffInterviewMutation<T, R>(mutationFn: (values: T) => Promise<R>, message: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn, retry: false,
    onSuccess: async () => { await client.invalidateQueries({ queryKey: interviewKeys.all }); toast.success(message); },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
export function useCriterionOverride(id: string, code: string) {
  const form = useForm<OverrideRequest>({ resolver: zodResolver(overrideRequestSchema), defaultValues: { criterion_code: code, new_level: 0, reason: "" } });
  const mutation = useStaffInterviewMutation((values: OverrideRequest) => interviewApi.overrideCriterion(id, values), "Đã lưu điểm Consultant.");
  return { form, mutation, save: form.handleSubmit(async (values) => { await mutation.mutateAsync(values).catch(() => undefined); }) };
}
const decisionFormSchema = z.object({
  decision: z.enum(["APPROVED", "NEEDS_REVISION", "REJECTED"]),
  reason: z.string().trim().max(4000), feedback: z.string().trim().max(4000), detailsText: z.string(),
}).superRefine((value, context) => {
  if (value.decision !== "APPROVED" && !value.reason) context.addIssue({ code: "custom", path: ["reason"], message: "Vui lòng nhập lý do." });
  if (value.detailsText.trim()) {
    try { const parsed: unknown = JSON.parse(value.detailsText); z.record(z.string(), z.unknown()).parse(parsed); }
    catch { context.addIssue({ code: "custom", path: ["detailsText"], message: "Chi tiết phải là một object JSON hợp lệ." }); }
  }
});
export function useInterviewDecision(id: string) {
  const form = useForm<z.infer<typeof decisionFormSchema>>({ resolver: zodResolver(decisionFormSchema), defaultValues: { decision: "APPROVED", reason: "", feedback: "", detailsText: "" } });
  const mutation = useStaffInterviewMutation((values: DecisionRequest) => interviewApi.decideInterview(id, values), "Đã lưu quyết định xét duyệt.");
  const save = form.handleSubmit(async ({ detailsText, ...values }) => {
    const details: unknown = detailsText.trim() ? JSON.parse(detailsText) : null;
    await mutation.mutateAsync(decisionRequestSchema.parse({ ...values, details })).catch(() => undefined);
  });
  return { form, mutation, save };
}
export function useInterviewAttemptGrant(tutorId: string, interviewId: string) {
  const form = useForm<AttemptGrantRequest>({ resolver: zodResolver(attemptGrantRequestSchema), defaultValues: { previous_interview_id: interviewId, reason: "" } });
  const mutation = useStaffInterviewMutation((values: AttemptGrantRequest) => interviewApi.grantAttempt(tutorId, values), "Đã cấp thêm lượt phỏng vấn.");
  return { form, mutation, save: form.handleSubmit(async (values) => { try { await mutation.mutateAsync(values); form.reset(); } catch { /* Preserve the reason when the request fails. */ } }) };
}
export function useInterviewPolicyForm(existingVersions: string[] = []) {
  const schema = policyRequestSchema.refine((values) => !existingVersions.includes(values.version), { path: ["version"], message: "Phiên bản đã tồn tại. Hãy dùng một phiên bản mới." });
  const form = useForm<PolicyRequest>({ resolver: zodResolver(schema), defaultValues: { version: "", content: "", confirmation_text: "" } });
  const mutation = useStaffInterviewMutation(interviewApi.createPolicy, "Đã tạo quy định. Chọn Áp dụng để sử dụng phiên bản mới.");
  return { form, mutation, save: form.handleSubmit(async (values) => { try { await mutation.mutateAsync(values); form.reset(); } catch { /* The mutation displays the API error. */ } }) };
}
const rubricUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.name.toLowerCase().endsWith(".toml") && file.size > 0 && file.size <= 1024 * 1024, "Chọn file TOML không rỗng, tối đa 1 MB."),
  note: z.string().trim().max(2000),
});
export function useInterviewRubricUpload() {
  const form = useForm<z.infer<typeof rubricUploadSchema>>({ resolver: zodResolver(rubricUploadSchema), defaultValues: { note: "" } });
  const { field: fileField } = useController({ control: form.control, name: "file" });
  const mutation = useStaffInterviewMutation(({ file, note }: z.infer<typeof rubricUploadSchema>) => interviewApi.uploadRubric(file, note), "Đã tải rubric lên. Chọn Áp dụng để sử dụng phiên bản mới.");
  return { form, file: fileField.value, mutation, save: form.handleSubmit(async (values) => { try { await mutation.mutateAsync(values); form.reset(); } catch { /* The mutation displays the API error. */ } }) };
}
