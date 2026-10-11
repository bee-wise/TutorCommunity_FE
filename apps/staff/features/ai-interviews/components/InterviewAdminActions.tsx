"use client";

import { useState } from "react";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/ui/dialog";
import { useStaffInterviewMutation } from "../hooks/useInterviewActions";
import { actionClass, fieldClass, panelClass } from "./InterviewUi";

export function InterviewAdminActions({ id, tutorId, canRescore, onDeleted }: { id: string; tutorId: string; canRescore: boolean; onDeleted: () => void }) {
  const [action, setAction] = useState<"rescore" | "delete" | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const rescore = useStaffInterviewMutation(interviewApi.rescoreInterview, "Đã yêu cầu AI chấm lại.");
  const remove = useStaffInterviewMutation(interviewApi.deleteTutorData, "Đã xóa dữ liệu phỏng vấn của gia sư.");
  const pending = rescore.isPending || remove.isPending;
  async function confirm() {
    try {
      if (action === "rescore") await rescore.mutateAsync(id);
      if (action === "delete" && confirmation === tutorId) { await remove.mutateAsync(tutorId); onDeleted(); }
      setAction(null); setConfirmation("");
    } catch { /* The mutation displays the API error and leaves the dialog open. */ }
  }
  return <section className={panelClass}><h2 className="text-lg font-bold">Thao tác Admin</h2><div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" className={actionClass} disabled={!canRescore || pending} onClick={() => setAction("rescore")}>Chấm lại bằng AI</Button><Button variant="destructive" className={actionClass} disabled={pending} onClick={() => setAction("delete")}>Xóa dữ liệu phỏng vấn</Button></div>
    <Dialog open={Boolean(action)} onOpenChange={(open) => { if (!open && !pending) { setAction(null); setConfirmation(""); } }}><DialogContent><DialogHeader><DialogTitle>{action === "delete" ? "Xóa toàn bộ dữ liệu của gia sư?" : "Yêu cầu AI chấm lại?"}</DialogTitle><DialogDescription>{action === "delete" ? "Xóa mọi buổi phỏng vấn, audio và video của gia sư này. Không thể hoàn tác." : "Điểm AI và điểm Consultant hiện có sẽ bị thay bằng kết quả chấm mới."}</DialogDescription></DialogHeader>{action === "delete" && <label className="text-sm">Nhập mã gia sư để xác nhận: <strong className="break-all">{tutorId}</strong><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={`mt-3 ${fieldClass}`} /></label>}<DialogFooter><Button variant="outline" className={actionClass} disabled={pending} onClick={() => setAction(null)}>Hủy</Button><Button variant={action === "delete" ? "destructive" : "default"} className={actionClass} disabled={pending || (action === "delete" && confirmation !== tutorId)} onClick={() => void confirm()}>{pending ? "Đang xử lý…" : "Xác nhận"}</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}
