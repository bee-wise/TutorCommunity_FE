import type { InterviewQuestion as Question } from "@workspace/core/ai-interviews/schemas/review.schema";
import { InterviewCriterion } from "./InterviewCriterion";
import { panelClass } from "./InterviewUi";

export function InterviewQuestion({ question, interviewId, canOverride }: { question: Question; interviewId: string; canOverride: boolean }) {
  const turn = question.turn;
  return <section className={panelClass}>
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-lg font-bold">{question.q_code} · {question.title}</h2><span className="font-bold tabular-nums">{question.points ?? "Chưa chấm"} / {question.max_points}</span></div>
    <p className="mt-3 text-sm text-muted-foreground">{question.objective}</p>
    {turn && <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <div><p className="mb-3 whitespace-pre-wrap text-sm leading-6">{turn.question}</p>{turn.video_url ? <video controls preload="metadata" src={turn.video_url} className="aspect-video w-full rounded-2xl border border-border bg-muted" aria-label={`Video câu ${question.q_code}`} /> : turn.audio_url ? <audio controls preload="none" src={turn.audio_url} className="w-full" aria-label={`Audio câu ${question.q_code}`} /> : <p className="text-sm text-muted-foreground">Chưa có bản ghi.</p>}</div>
      <div><h3 className="text-sm font-bold">Bản chép lời</h3><p className="mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-muted p-4 text-sm leading-7">{turn.transcript ?? "Chưa có bản chép lời."}</p>{turn.needs_review && <p className="mt-3 text-sm text-warning">{turn.review_reasons.join(", ")}</p>}</div>
      {turn.followup && <><div><h3 className="mb-3 text-sm font-bold">Câu hỏi bổ sung</h3><p className="mb-3 whitespace-pre-wrap text-sm">{turn.followup}</p>{turn.followup_video_url ? <video controls preload="metadata" src={turn.followup_video_url} className="aspect-video w-full rounded-2xl border border-border bg-muted" aria-label={`Video bổ sung ${question.q_code}`} /> : turn.followup_audio_url ? <audio controls preload="none" src={turn.followup_audio_url} className="w-full" aria-label={`Audio bổ sung ${question.q_code}`} /> : null}</div><p className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-muted p-4 text-sm leading-7">{turn.followup_transcript ?? "Chưa có bản chép lời bổ sung."}</p></>}
    </div>}
    <div className="mt-5 space-y-3">{question.criteria.map((criterion) => <InterviewCriterion key={criterion.criterion_code} criterion={criterion} interviewId={interviewId} canOverride={canOverride} />)}</div>
  </section>;
}
