import type { ReactNode } from "react";
import {
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  evidenceLabel,
  reviewDigest,
  reviewReason,
} from "../utils/interview-presentation";
import { Chip, panelClass, SectionTitle } from "./InterviewUi";
import { InterviewConflicts } from "./InterviewConflicts";
import { InterviewScoreBreakdown } from "./InterviewScoreBreakdown";
import { InterviewIntegrityCard } from "./InterviewIntegrityCard";

export function InterviewReport({
  data,
  onOpenAnswers,
}: {
  data: InterviewPackage;
  onOpenAnswers: () => void;
}) {
  const { summary, report } = data;
  const digest = reviewDigest(data);
  const todos = [
    digest.conflicts > 0 && {
      label: `${digest.conflicts} thông tin phỏng vấn khác với hồ sơ`,
      hint: "Đối chiếu ở mục “Đối chiếu với hồ sơ” bên dưới.",
    },
    digest.verifications > 0 && {
      label: `${digest.verifications} nội dung tự khai cần xác minh`,
      hint: "Yêu cầu gia sư cung cấp giấy tờ hoặc thông tin tham chiếu.",
    },
    digest.unscoredQuestions > 0 && {
      label: `${digest.unscoredQuestions} câu hỏi chưa có điểm`,
      hint: "Mở từng câu, xem bản ghi và chấm lại các tiêu chí còn thiếu.",
      action: true,
    },
    digest.flaggedCriteria > 0 && {
      label: `${digest.flaggedCriteria} tiêu chí AI đề nghị xem lại`,
      hint: "Các tiêu chí này được gắn nhãn ở phần chấm điểm.",
      action: true,
    },
    digest.integrity && {
      label: "Có dấu hiệu bất thường khi làm bài",
      hint: "Đối chiếu với video, không dùng để tự động đổi điểm.",
    },
  ].filter(Boolean) as { label: string; hint: string; action?: boolean }[];
  return (
    <div className="space-y-5">
      <section
        className={`${panelClass} ${todos.length ? "border-accent" : ""}`}
      >
        <SectionTitle
          icon={
            todos.length ? <ExclamationTriangleIcon /> : <CheckCircleIcon />
          }
          aside={
            todos.length ? (
              <Chip tone="flag">{todos.length} mục cần xử lý</Chip>
            ) : (
              <Chip tone="ok">Không có cảnh báo</Chip>
            )
          }
        >
          Cần xử lý trước khi quyết định
        </SectionTitle>
        {todos.length ? (
          <ul className="mt-4 divide-y divide-border">
            {todos.map((item) => (
              <li
                key={item.label}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.hint}</p>
                </div>
                {item.action && (
                  <button
                    type="button"
                    onClick={onOpenAnswers}
                    className="min-h-11 rounded-full px-3 text-xs font-bold text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Xem câu trả lời
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            AI chưa phát hiện điểm cần xác minh. Vẫn nên xem bản ghi trước khi
            quyết định.
          </p>
        )}
        {!!summary?.human_review_reasons.length && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Lý do AI đánh dấu:
            </span>
            {summary.human_review_reasons.map((reason) => (
              <Chip key={reason}>{reviewReason(reason)}</Chip>
            ))}
          </div>
        )}
      </section>
      {summary && <InterviewScoreBreakdown summary={summary} />}
      <InterviewConflicts conflicts={report?.data_conflicts ?? []} />
      {!!report?.verification_required.length && (
        <section className={panelClass}>
          <SectionTitle
            icon={<ClipboardDocumentCheckIcon />}
            aside={<Chip>{report.verification_required.length} mục</Chip>}
          >
            Minh chứng cần xác minh
          </SectionTitle>
          <ul className="mt-4 space-y-3">
            {report.verification_required.map((item, index) => (
              <li key={index} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>{item.q_code}</Chip>
                  <span className="text-xs text-muted-foreground">
                    {evidenceLabel(item.evidence_type)}
                  </span>
                </div>
                <blockquote className="mt-2 text-sm leading-6">
                  “{item.claim}”
                </blockquote>
                <p className="mt-2 rounded-xl bg-muted p-3 text-sm leading-6">
                  <strong>Cần làm: </strong>
                  {item.what_to_verify}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className={panelClass}>
        <h2 className="font-nunito text-lg font-extrabold">Nhận định của AI</h2>
        {!report ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Chưa có báo cáo AI.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ReportList
              icon={<HandThumbUpIcon className="size-5 text-secondary" />}
              title="Điểm mạnh"
              items={report.strengths}
            />
            <ReportList
              icon={<LightBulbIcon className="size-5 text-warning" />}
              title="Cần cải thiện"
              items={report.improvements}
            />
          </div>
        )}
        {!!Object.keys(report?.question_comments ?? {}).length && (
          <DisclosureCard
            title="Nhận xét theo từng câu hỏi"
            variant="subtle"
            className="mt-4"
          >
            <ul className="space-y-3">
              {Object.entries(report?.question_comments ?? {}).map(
                ([code, comment]) => (
                  <li key={code} className="flex gap-3 text-sm leading-6">
                    <Chip>{code}</Chip>
                    <span>{comment}</span>
                  </li>
                ),
              )}
            </ul>
          </DisclosureCard>
        )}
      </section>
      <InterviewIntegrityCard summary={data.integrity_summary} />
    </div>
  );
}
function ReportList({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        {icon}
        {title}
      </h3>
      {items.length ? (
        <ul className="mt-3 space-y-2.5 text-sm leading-6">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
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
