import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { panelClass } from "./InterviewUi";

export function InterviewReport({ data }: { data: InterviewPackage }) {
  const { summary, report } = data;
  return <>
    <section className={panelClass}><h2 className="text-lg font-bold">Điểm và nhận định AI</h2><div className="mt-4 flex flex-wrap items-center gap-4"><strong className="text-3xl text-primary tabular-nums">{summary?.overall_score ?? "Chưa có điểm"}{summary && " /100"}</strong><span className="text-sm">{summary?.assessment_level ?? "Chưa chấm"}</span></div><p className="mt-3 text-sm text-muted-foreground">Nhận định AI là thông tin hỗ trợ. Quyết định cuối cùng do Consultant xét duyệt.</p>{summary && !summary.score_complete && <p className="mt-3 font-semibold text-warning">Điểm chưa đầy đủ. Kiểm tra các tiêu chí chưa được chấm.</p>}{summary?.requires_human_review && <p className="mt-3 text-sm text-warning">Cần xem kỹ: {summary.human_review_reasons.join(", ")}</p>}
      {summary && <dl className="mt-4 grid gap-2 sm:grid-cols-2">{summary.questions.map((item) => <div key={item.q_code} className="flex justify-between gap-3 rounded-2xl bg-muted p-3 text-sm"><dt>{item.q_code} · {item.title}</dt><dd className="shrink-0 font-semibold tabular-nums">{item.points ?? "Chưa chấm"}/{item.max_points}</dd></div>)}</dl>}
    </section>
    {!!report?.data_conflicts.length && <section className={`${panelClass} border-destructive`}><h2 className="text-lg font-bold text-destructive">Mâu thuẫn cần xác minh</h2><div className="mt-4 space-y-4">{report.data_conflicts.map((item, index) => <article key={index} className="rounded-2xl border border-border p-4 text-sm"><p className="font-bold">{item.q_code} · {item.criterion_codes.join(", ")}</p><p className="mt-2">Phỏng vấn: “{item.interview_quote}”</p><p className="mt-2">Hồ sơ ({item.profile.label}): {item.profile.text}</p><p className="mt-2 text-warning">{item.note} · {item.status}</p></article>)}</div></section>}
    {report && <section className={panelClass}><h2 className="text-lg font-bold">Báo cáo và mục cần kiểm tra</h2><div className="mt-4 grid gap-5 sm:grid-cols-2"><ReportList title="Điểm mạnh" items={report.strengths} /><ReportList title="Cần cải thiện" items={report.improvements} /></div>{report.verification_required.map((item, index) => <div key={index} className="mt-4 rounded-2xl border border-border p-4 text-sm"><strong>{item.q_code} · Cần xác minh</strong><p className="mt-2">{item.claim}</p><p className="mt-2">{item.what_to_verify} · {item.evidence_type}</p></div>)}{report.items_to_check.map((item, index) => <p key={index} className="mt-3 text-sm text-warning">{item.ref}: {item.reasons.join(", ")}</p>)}{Object.entries(report.question_comments).map(([code, comment]) => <p key={code} className="mt-3 text-sm"><strong>{code}:</strong> {comment}</p>)}{report.policy && <p className="mt-4 text-xs text-muted-foreground">Quy định {report.policy.version} · {report.policy.status} · Xác nhận {report.policy.confirmed_at}</p>}</section>}
    <DisclosureCard variant="default" title="Hồ sơ gia sư hiện tại" className={panelClass}>
      {data.tutor_error && <p role="alert" className="mt-3 text-sm text-warning">{data.tutor_error}</p>}
      <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-all rounded-2xl bg-muted p-4 text-xs">{data.tutor ? JSON.stringify(data.tutor, null, 2) : "Không có dữ liệu hồ sơ."}</pre>
    </DisclosureCard>
  </>;
}
function ReportList({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="font-semibold">{title}</h3>{items.length ? <ul className="mt-3 grid gap-2 text-sm leading-6">{items.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Chưa có nhận định.</p>}</div>;
}
