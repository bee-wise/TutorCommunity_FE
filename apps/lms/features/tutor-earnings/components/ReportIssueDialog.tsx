"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import type { EarningSession } from "../types/earnings.types";
import { reportIssueSchema, type ReportIssueInput } from "../types/earnings.schemas";
import { EarningsSelect } from "./EarningsSelect";
import { inputClass, outlineActionClass, primaryActionClass } from "./earnings-ui";

const ISSUES = ["Trạng thái quyết toán chưa chính xác", "Học phí buổi học chưa đúng", "Thời lượng buổi học chưa đúng", "Chưa nhận được khoản quyết toán"].map((label) => ({ label, value: label }));

interface ReportDialogProps {
  session: EarningSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, description: string) => void;
}

export function ReportIssueDialog({ session, open, onOpenChange, onSubmit }: ReportDialogProps) {
  const form = useForm<ReportIssueInput>({ resolver: zodResolver(reportIssueSchema), defaultValues: { title: ISSUES[0]?.value ?? "", description: "" } });
  if (!session) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border-border bg-card p-5 shadow-soft sm:p-6">
        <form noValidate onSubmit={form.handleSubmit((data) => { onSubmit(data.title, data.description); form.reset(); })}>
          <DialogHeader className="pr-6 text-left"><DialogTitle className="font-nunito text-xl font-extrabold leading-relaxed text-primary">Báo cáo vấn đề</DialogTitle><DialogDescription>Buổi {session.sessionCode} · {session.className}</DialogDescription></DialogHeader>
          <div className="mt-5 space-y-4">
            <div className="grid gap-2"><label htmlFor="earnings-report-issue" className="text-sm font-bold">Vấn đề cần hỗ trợ</label><Controller control={form.control} name="title" render={({ field }) => <EarningsSelect id="earnings-report-issue" value={field.value} options={ISSUES} onValueChange={field.onChange} />} />{form.formState.errors.title && <p role="alert" className="text-xs text-destructive">{form.formState.errors.title.message}</p>}</div>
            <label className="grid gap-2"><span className="text-sm font-bold">Mô tả chi tiết</span><textarea {...form.register("description")} maxLength={2000} aria-invalid={!!form.formState.errors.description} aria-describedby="earnings-report-description-help" placeholder="Thông tin cần admin kiểm tra…" className={`${inputClass} min-h-32 resize-y`} /><span id="earnings-report-description-help" role={form.formState.errors.description ? "alert" : undefined} className={`text-xs ${form.formState.errors.description ? "text-destructive" : "text-muted-foreground"}`}>{form.formState.errors.description?.message ?? "Từ 10 đến 2.000 ký tự."}</span></label>
            <p className="text-xs leading-relaxed text-muted-foreground">Bản mock: đơn chỉ được lưu trong phiên hiện tại, chưa gửi đến admin.</p>
          </div>
          <DialogFooter className="mt-5 gap-2 border-t border-border pt-4"><button type="button" className={outlineActionClass} onClick={() => onOpenChange(false)}>Hủy</button><button type="submit" className={primaryActionClass}>Tạo đơn báo cáo</button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
