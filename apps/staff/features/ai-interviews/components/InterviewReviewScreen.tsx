"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInterviewPackageQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { canGrantInterviewAttempt, isReviewableInterview } from "@workspace/core/ai-interviews/interview-status";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Button } from "@workspace/ui/components/ui/button";
import { actionClass, InterviewQueryState, InterviewStatus, panelClass } from "./InterviewUi";
import { InterviewAudit } from "./InterviewAudit";
import { InterviewReport } from "./InterviewReport";
import { InterviewQuestion } from "./InterviewQuestion";
import { InterviewAttemptGrant, InterviewDecisionForm } from "./InterviewDecisionForm";
import { InterviewAdminActions } from "./InterviewAdminActions";

export function InterviewReviewScreen({ id, role }: { id: string; role: "consultant" | "admin" }) {
  const router = useRouter();
  const userRole = useAuthStore((store) => store.user?.role?.toLowerCase());
  const query = useInterviewPackageQuery(id);
  if (userRole !== role) return <p className="p-6 text-sm">Đang xác minh quyền truy cập…</p>;
  const data = query.data;
  return <main className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Hồ sơ phỏng vấn AI</h1><Button asChild variant="outline" className={actionClass}><Link href={`/${role}/ai-interviews`}>Danh sách phỏng vấn</Link></Button></div>
    <InterviewQueryState pending={query.isPending} error={query.error} retry={() => void query.refetch()} />
    {data && <>
      <section className={panelClass}><div className="flex flex-wrap justify-between gap-3"><InterviewStatus status={data.interview.status} /><Button size="sm" variant="outline" className={actionClass} disabled={query.isFetching} onClick={() => void query.refetch()}>Cập nhật hồ sơ và bản ghi</Button></div><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Mã gia sư</dt><dd className="mt-1 break-all font-medium">{data.interview.tutor_id}</dd></div><div><dt className="text-xs text-muted-foreground">Bộ câu hỏi</dt><dd className="mt-1 font-medium">{data.interview.rubric_version}</dd></div></dl><p className="mt-3 text-xs text-muted-foreground">Link bản ghi hết hạn sau 15 phút. Cập nhật hồ sơ để lấy link mới nếu không phát được.</p></section>
      <InterviewReport data={data} />
      {data.questions.map((question) => <InterviewQuestion key={question.q_code} question={question} interviewId={id} canOverride={role === "consultant" && isReviewableInterview(data.interview.status)} />)}
      <div className="grid gap-5 lg:grid-cols-2">{role === "consultant" ? <InterviewDecisionForm id={id} enabled={data.interview.status === "PENDING_REVIEW"} /> : <InterviewAdminActions id={id} tutorId={data.interview.tutor_id} canRescore={isReviewableInterview(data.interview.status)} onDeleted={() => router.replace("/admin/ai-interviews")} />}<InterviewAttemptGrant key={id} id={id} tutorId={data.interview.tutor_id} enabled={canGrantInterviewAttempt(data.interview.status)} /></div>
      <section className={panelClass}><h2 className="text-lg font-bold">Lịch sử quyết định</h2>{!data.decisions.length && <p className="mt-3 text-sm text-muted-foreground">Chưa có quyết định.</p>}<div className="mt-4 space-y-3">{data.decisions.map((decision) => <article key={decision.id} className="rounded-2xl border border-border p-4 text-sm"><InterviewStatus status={decision.decision} /><p className="mt-2">{decision.reason}</p><p className="mt-2 whitespace-pre-wrap">{decision.feedback}</p><p className="mt-3 text-xs text-muted-foreground">{new Date(decision.created_at).toLocaleString("vi-VN")} · {decision.synced_at ? "Đã đồng bộ BeeWise Core" : "Đang chờ đồng bộ BeeWise Core"}</p>{decision.details && <pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(decision.details, null, 2)}</pre>}</article>)}</div></section>
      <InterviewAudit entity="interview" id={id} />
    </>}
  </main>;
}
