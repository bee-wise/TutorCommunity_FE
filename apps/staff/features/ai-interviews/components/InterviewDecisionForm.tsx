"use client";

import { Controller } from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/ui/select";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { useInterviewAttemptGrant, useInterviewDecision } from "../hooks/useInterviewActions";
import { actionClass, fieldClass, FieldError, panelClass } from "./InterviewUi";

export function InterviewDecisionForm({ id, enabled }: { id: string; enabled: boolean }) {
  const { form, mutation, save } = useInterviewDecision(id);
  return <section className={panelClass}><h2 className="text-lg font-bold">Quyết định xét duyệt</h2>{!enabled && <p className="mt-3 text-sm text-muted-foreground">Chỉ ra quyết định khi buổi ở trạng thái chờ Consultant duyệt.</p>}<form onSubmit={save} className="mt-5"><fieldset disabled={!enabled || mutation.isPending} className="space-y-4">
    <label className="block text-sm font-medium" htmlFor="interview-decision">Kết quả</label><Controller control={form.control} name="decision" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={!enabled || mutation.isPending}><SelectTrigger id="interview-decision" className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="APPROVED">Phê duyệt</SelectItem><SelectItem value="NEEDS_REVISION">Yêu cầu bổ sung hồ sơ</SelectItem><SelectItem value="REJECTED">Từ chối</SelectItem></SelectContent></Select>} />
    <label className="block text-sm font-medium">Lý do<textarea {...form.register("reason")} maxLength={4000} rows={3} className={`mt-2 ${fieldClass}`} /></label><FieldError message={form.formState.errors.reason?.message} />
    <label className="block text-sm font-medium">Phản hồi gửi gia sư<textarea {...form.register("feedback")} maxLength={4000} rows={3} className={`mt-2 ${fieldClass}`} /></label><FieldError message={form.formState.errors.feedback?.message} />
    <DisclosureCard
      variant="subtle"
      size="sm"
      title="Chi tiết bổ sung"
      description="Các mục cần bổ sung / phát hiện / vấn đề (object JSON)"
      className="mt-2"
    >
      <label className="block text-xs font-medium text-muted-foreground">
        Nội dung chi tiết
        <textarea {...form.register("detailsText")} rows={4} className={`mt-2 font-mono ${fieldClass}`} placeholder={'{"items": ["Minh chứng kinh nghiệm"]}'} />
      </label>
      <FieldError message={form.formState.errors.detailsText?.message} />
    </DisclosureCard>
    <Button type="submit" className={actionClass}>{mutation.isPending ? "Đang lưu…" : "Lưu quyết định"}</Button>
  </fieldset></form></section>;
}
export function InterviewAttemptGrant({ tutorId, id, enabled }: { tutorId: string; id: string; enabled: boolean }) {
  const { form, mutation, save } = useInterviewAttemptGrant(tutorId, id);
  return <section className={panelClass}><h2 className="text-lg font-bold">Cấp lại lượt phỏng vấn</h2><form onSubmit={save} className="mt-4"><fieldset disabled={!enabled || mutation.isPending}><label className="text-sm font-medium">Lý do cấp lượt<textarea {...form.register("reason")} rows={3} maxLength={2000} className={`mt-2 ${fieldClass}`} /></label><FieldError message={form.formState.errors.reason?.message} /><Button type="submit" className={`mt-4 ${actionClass}`}>{mutation.isPending ? "Đang cấp…" : "Cấp thêm một lượt"}</Button></fieldset></form>{!enabled && <p className="mt-3 text-xs text-muted-foreground">Chỉ cấp lại lượt cho buổi đã kết thúc.</p>}</section>;
}
