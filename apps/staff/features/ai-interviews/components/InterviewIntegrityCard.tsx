import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import type { IntegritySummary } from "@workspace/core/ai-interviews/schemas/review.schema";
import { integrityReason } from "../utils/interview-presentation";
import { Chip, panelClass, SectionTitle } from "./InterviewUi";

export function InterviewIntegrityCard({
  summary,
}: {
  summary: IntegritySummary | null | undefined;
}) {
  if (!summary) return null;
  const hasIssues = summary.requires_review;
  const stats = [
    { label: "Thoát toàn màn hình", value: `${summary.fullscreen_exit_count} lần` },
    { label: "Rời tab", value: `${summary.page_hidden_count} lần` },
    {
      label: "Dữ liệu giám sát",
      value: summary.telemetry_complete ? "Đầy đủ" : "Không đầy đủ",
    },
  ];
  return (
    <section aria-label="Giám sát khi làm bài" className={panelClass}>
      <SectionTitle
        icon={hasIssues ? <ShieldExclamationIcon /> : <ShieldCheckIcon />}
        aside={
          hasIssues ? (
            <Chip tone="flag">Cần đối chiếu</Chip>
          ) : (
            <Chip tone="ok">Bình thường</Chip>
          )
        }
      >
        Giám sát khi làm bài
      </SectionTitle>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl bg-muted p-3.5">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 text-base font-extrabold tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      {!!summary.review_reasons.length && (
        <p className="mt-3 text-sm">
          <strong>Lưu ý: </strong>
          {summary.review_reasons.map(integrityReason).join("; ")}
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Chỉ để tham khảo khi xem video, không tự động đổi điểm hay kết quả.
      </p>
    </section>
  );
}
