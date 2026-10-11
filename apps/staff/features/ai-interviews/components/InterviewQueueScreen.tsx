"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useInterviewListQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Button } from "@workspace/ui/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/ui/select";
import { interviewStatusLabels } from "@workspace/core/ai-interviews/interview-status";
import { actionClass, InterviewQueryState, InterviewStatus, panelClass } from "./InterviewUi";

export function InterviewQueueScreen({ role }: { role: "consultant" | "admin" }) {
  const userRole = useAuthStore((store) => store.user?.role?.toLowerCase());
  const [status, setStatus] = useState(role === "consultant" ? "PENDING_REVIEW" : "all");
  const [offset, setOffset] = useState(0);
  const query = useInterviewListQuery({ status: status === "all" ? undefined : status, offset, limit: 20 });
  if (userRole !== role) return <p className="p-6 text-sm">Đang xác minh quyền truy cập…</p>;
  return <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Phỏng vấn AI</h1>{role === "admin" && <Button asChild variant="outline" className={actionClass}><Link href="/admin/ai-interviews/settings">Quy định và rubric</Link></Button>}</div>
    <div className="flex flex-wrap items-center gap-3">
      <Select value={status} onValueChange={(value) => { setStatus(value); setOffset(0); }}><SelectTrigger aria-label="Lọc trạng thái phỏng vấn" className="w-full rounded-2xl sm:w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem>{Object.entries(interviewStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
      <Button variant="outline" className={actionClass} disabled={query.isFetching} onClick={() => void query.refetch()}><ArrowPathIcon className="size-4" />Cập nhật</Button>
    </div>
    <InterviewQueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} />
    {query.data && <section className={panelClass}>
      {!query.data.length ? <p className="py-8 text-center text-sm text-muted-foreground">Không có buổi phỏng vấn trong bộ lọc này.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border text-xs text-muted-foreground"><th className="pb-3 pr-4 font-semibold">Gia sư / buổi phỏng vấn</th><th className="pb-3 pr-4 font-semibold">Trạng thái</th><th className="pb-3 pr-4 font-semibold">Điểm /100</th><th className="pb-3 pr-4 font-semibold">Thời gian nộp</th><th className="pb-3 font-semibold"><span className="sr-only">Xem hồ sơ</span></th></tr></thead><tbody>{query.data.map((item) => <tr key={item.interview_id} className="border-b border-border last:border-0">
        <td className="py-4 pr-4"><p className="max-w-56 break-all font-medium">{item.tutor_id}</p><p className="mt-1 max-w-56 break-all text-xs text-muted-foreground">{item.interview_id}</p></td>
        <td className="py-4 pr-4"><InterviewStatus status={item.status} />{item.manual_review_required && <p className="mt-2 text-xs font-medium text-warning">Cần xem kỹ</p>}</td><td className="py-4 pr-4 tabular-nums">{item.overall_score ?? "Chưa có điểm"}</td><td className="whitespace-nowrap py-4 pr-4">{new Date(item.submitted_at ?? item.started_at).toLocaleString("vi-VN")}</td>
        <td className="py-4"><Button asChild variant="outline" size="sm" className={actionClass}><Link href={`/${role}/ai-interviews/${encodeURIComponent(item.interview_id)}`}>Xem hồ sơ</Link></Button></td>
      </tr>)}</tbody></table></div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Trang {Math.floor(offset / 20) + 1}</span><div className="flex gap-2"><Button variant="outline" className={actionClass} disabled={!offset || query.isFetching} onClick={() => setOffset((value) => value - 20)}>Trang trước</Button><Button variant="outline" className={actionClass} disabled={query.data.length < 20 || query.isFetching} onClick={() => setOffset((value) => value + 20)}>Trang tiếp</Button></div></div>
    </section>}
  </main>;
}
