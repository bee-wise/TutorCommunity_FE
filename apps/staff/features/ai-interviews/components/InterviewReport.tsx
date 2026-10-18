import {
  ExclamationTriangleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { reviewReason } from "../utils/interview-presentation";
import { panelClass } from "./InterviewUi";
import { InterviewConflicts } from "./InterviewConflicts";
import { InterviewScoreBreakdown } from "./InterviewScoreBreakdown";
import { InterviewIntegrityCard } from "./InterviewIntegrityCard";

export function InterviewReport({ data }: { data: InterviewPackage }) {
  const { summary, report } = data;
  const needsReview =
    data.interview.manual_review_required || summary?.requires_human_review;
  return (
    <div className="space-y-5">
      <InterviewIntegrityCard summary={data.integrity_summary} />
      <section
        className={`${panelClass} ${needsReview || (summary && !summary.score_complete) ? "border-accent/70" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent/20">
            <ExclamationTriangleIcon className="size-5" />
          </span>
          <h2 className="font-nunito text-lg font-extrabold">
            Các điểm cần kiểm tra
          </h2>
        </div>
        {summary && !summary.score_complete && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-accent/15 p-3 text-sm font-semibold"
          >
            Điểm chưa đầy đủ. Kiểm tra các tiêu chí chưa được chấm trước khi
            quyết định.
          </p>
        )}
        {needsReview && (
          <p className="mt-4 text-sm font-medium">
            AI đánh dấu buổi phỏng vấn này cần Consultant xem kỹ.
          </p>
        )}
        {!!summary?.human_review_reasons.length && (
          <ul className="mt-3 space-y-2 text-sm">
            {summary.human_review_reasons.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {reviewReason(reason)}
              </li>
            ))}
          </ul>
        )}
        {!needsReview &&
          !report?.data_conflicts.length &&
          !report?.verification_required.length && (
            <p className="mt-4 text-sm text-muted-foreground">
              Chưa có cảnh báo xác minh từ AI. Đối chiếu câu trả lời và minh
              chứng trước khi xét duyệt.
            </p>
          )}
        <InterviewConflicts conflicts={report?.data_conflicts ?? []} />
        {!!report?.verification_required.length && (
          <div className="mt-5 border-t border-border pt-5">
            <h3 className="font-nunito font-extrabold">
              Minh chứng cần xác minh
            </h3>
            {report.verification_required.map((item, index) => (
              <DisclosureCard
                key={index}
                title={`${item.q_code} · ${item.claim}`}
                variant="subtle"
                className="mt-3"
              >
                <p className="text-sm leading-6">{item.what_to_verify}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Loại minh chứng: {item.evidence_type}
                </p>
              </DisclosureCard>
            ))}
          </div>
        )}
        {!!report?.items_to_check.length && (
          <DisclosureCard
            title={`Các mục cần xem lại (${report.items_to_check.length})`}
            variant="subtle"
            className="mt-4"
          >
            <ul className="space-y-3 text-sm">
              {report.items_to_check.map((item, index) => (
                <li key={index}>
                  <strong>{item.ref}: </strong>
                  {item.reasons.map(reviewReason).join("; ")}
                </li>
              ))}
            </ul>
          </DisclosureCard>
        )}
      </section>
      <section className={panelClass}>
        <div className="flex items-center gap-3">
          <CheckBadgeIcon className="size-5 text-primary" />
          <h2 className="font-nunito text-lg font-extrabold">Nhận định AI</h2>
        </div>
        {!report ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Chưa có báo cáo AI.
          </p>
        ) : (
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <ReportList title="Điểm mạnh" items={report.strengths} />
            <ReportList title="Cần cải thiện" items={report.improvements} />
          </div>
        )}
        {!!Object.keys(report?.question_comments ?? {}).length && (
          <DisclosureCard
            title="Nhận xét theo câu hỏi"
            variant="subtle"
            className="mt-5"
          >
            {Object.entries(report?.question_comments ?? {}).map(
              ([code, comment]) => (
                <p
                  key={code}
                  className="mt-2 whitespace-pre-wrap text-sm leading-6"
                >
                  <strong>{code}: </strong>
                  {comment}
                </p>
              ),
            )}
          </DisclosureCard>
        )}
        {report?.policy && (
          <DisclosureCard
            title="Xác nhận quy định"
            variant="subtle"
            className="mt-4"
          >
            <div className="space-y-2 text-sm">
              <div>
                Phiên bản: <strong>{report.policy.version}</strong>
              </div>
              <div>Trạng thái: {report.policy.status}</div>
              <div>Thời điểm xác nhận: {report.policy.confirmed_at}</div>
            </div>
          </DisclosureCard>
        )}
      </section>
      {summary && <InterviewScoreBreakdown summary={summary} />}
    </div>
  );
}
function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-primary">{title}</h3>
      {items.length ? (
        <ul className="mt-3 space-y-3 text-sm leading-6">
          {items.map((item, index) => (
            <li key={index} className="border-l-2 border-border pl-3">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Chưa có nhận định.</p>
      )}
    </div>
  );
}
