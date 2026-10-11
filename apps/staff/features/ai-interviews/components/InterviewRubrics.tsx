"use client";

import { useState } from "react";
import { ArrowDownTrayIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useInterviewRubricQuery, useInterviewRubricsQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/ui/dialog";
import { useInterviewRubricUpload, useStaffInterviewMutation } from "../hooks/useInterviewActions";
import { useInterviewRubricExport } from "../hooks/useInterviewRubricEditor";
import { actionClass, fieldClass, FieldError, InterviewQueryState, panelClass } from "./InterviewUi";
import { InterviewAudit } from "./InterviewAudit";
import { InterviewRubricEditor } from "./InterviewRubricEditor";
import { InterviewRubricFileInput } from "./InterviewRubricFileInput";

export function InterviewRubrics() {
  const query = useInterviewRubricsQuery();
  const [version, setVersion] = useState("");
  const [activation, setActivation] = useState("");
  const [editing, setEditing] = useState(false);
  const detail = useInterviewRubricQuery(version);
  const exportToml = useInterviewRubricExport(detail.data?.content, version);
  const { form, file, mutation, save } = useInterviewRubricUpload();
  const activate = useStaffInterviewMutation(interviewApi.activateRubric, "Đã áp dụng bộ câu hỏi mới.");
  return <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
    <div className="space-y-5"><InterviewQueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} />
      {query.data?.length === 0 && <p className={panelClass}>Chưa có bộ câu hỏi. Tải lên file TOML để tạo phiên bản đầu tiên.</p>}
      {query.data?.map((item) => <article key={item.version} className={panelClass}><div className="flex flex-wrap justify-between gap-3"><h2 className="font-bold">Rubric {item.version}</h2><span className={`rounded-full border border-border px-3 py-1 text-xs font-bold ${item.is_active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{item.is_active ? "Đang áp dụng" : item.is_default ? "Bản dự phòng" : "Chưa áp dụng"}</span></div><p className="mt-3 whitespace-pre-wrap text-sm">{item.note}</p><p className="mt-2 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("vi-VN")}</p><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" size="sm" className={actionClass} onClick={() => { setVersion(item.version); setEditing(false); }}>Xem cấu hình và lịch sử</Button><Button variant="outline" size="sm" className={actionClass} disabled={item.is_active || activate.isPending} onClick={() => setActivation(item.version)}>Áp dụng</Button></div></article>)}
      {version && <><section className={panelClass}><h2 className="font-bold">Cấu hình {version}</h2><div className="mt-4"><InterviewQueryState pending={detail.isPending} error={detail.error} retry={() => void detail.refetch()} />{detail.data && <><div className="mb-4 flex flex-wrap gap-2"><Button variant="outline" className={actionClass} onClick={() => setEditing(true)} disabled={editing}><PencilSquareIcon className="size-4" />Chỉnh thành bản mới</Button><Button variant="outline" className={actionClass} onClick={exportToml}><ArrowDownTrayIcon className="size-4" />Xuất TOML</Button></div><pre className="max-h-[600px] overflow-auto whitespace-pre-wrap break-all rounded-2xl bg-muted p-4 text-xs leading-6">{JSON.stringify(detail.data.content, null, 2)}</pre></>}</div></section>{editing && detail.data && <InterviewRubricEditor key={version} content={detail.data.content} version={version} existingVersions={query.data?.map((item) => item.version) ?? []} onCancel={() => setEditing(false)} onCreated={(createdVersion) => { setEditing(false); setVersion(createdVersion); }} />}<InterviewAudit key={version} entity="rubric" id={version} /></>}
    </div>
    <section className={panelClass}><h2 className="text-lg font-bold">Tải bộ câu hỏi mới</h2><p className="mt-3 text-sm text-muted-foreground">File TOML tối đa 1 MB. Phiên bản nằm trong file; bản mới chưa áp dụng cho đến khi bạn xác nhận.</p><form onSubmit={save} className="mt-5"><fieldset disabled={mutation.isPending} className="space-y-4">
      <InterviewRubricFileInput file={file} onChange={(selected) => { if (selected) form.setValue("file", selected, { shouldValidate: true }); else form.resetField("file"); }} /><FieldError message={form.formState.errors.file?.message} />
      <label className="block text-sm font-medium">Ghi chú thay đổi<textarea {...form.register("note")} rows={4} maxLength={2000} className={`mt-2 ${fieldClass}`} /></label><FieldError message={form.formState.errors.note?.message} /><Button type="submit" className={actionClass}>{mutation.isPending ? "Đang tải lên…" : "Tải rubric lên"}</Button>
    </fieldset></form></section>
    <Dialog open={Boolean(activation)} onOpenChange={(open) => { if (!open && !activate.isPending) setActivation(""); }}><DialogContent><DialogHeader><DialogTitle>Áp dụng rubric {activation}?</DialogTitle><DialogDescription>Chỉ các buổi phỏng vấn mới dùng bộ câu hỏi này. Buổi đang làm hoặc đã chấm giữ nguyên phiên bản cũ.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" className={actionClass} disabled={activate.isPending} onClick={() => setActivation("")}>Hủy</Button><Button className={actionClass} disabled={activate.isPending} onClick={() => activate.mutate(activation, { onSuccess: () => setActivation("") })}>Xác nhận áp dụng</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
