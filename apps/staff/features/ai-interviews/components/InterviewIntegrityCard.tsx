import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import type { IntegritySummary } from "@workspace/core/ai-interviews/schemas/review.schema";
import { panelClass } from "./InterviewUi";

export function InterviewIntegrityCard({
  summary,
}: {
  summary: IntegritySummary | null | undefined;
}) {
  if (!summary) return null;

  const hasIssues = summary.requires_review;

  return (
    <section
      aria-label="Giám sát toàn vẹn phỏng vấn"
      className={`${panelClass} ${hasIssues ? "border-warning/60 bg-warning/5" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 items-center justify-center rounded-xl ${
              hasIssues ? "bg-warning/20 text-warning" : "bg-primary/10 text-primary"
            }`}
          >
            {hasIssues ? (
              <ShieldExclamationIcon className="size-5" aria-hidden="true" />
            ) : (
              <ShieldCheckIcon className="size-5" aria-hidden="true" />
            )}
          </span>
          <div>
            <h2 className="font-nunito text-lg font-extrabold text-foreground">
              Giám sát toàn vẹn phỏng vấn
            </h2>
            <p className="text-xs text-muted-foreground">
              Nhật ký chuyển tab và trạng thái toàn màn hình khi làm bài
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            hasIssues
              ? "border border-warning/40 bg-warning/20 text-warning"
              : "border border-secondary/40 bg-secondary/15 text-secondary"
          }`}
        >
          {hasIssues ? "Cần đối chiếu" : "Bình thường"}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-2xs">
          <dt className="text-xs font-medium text-muted-foreground">
            Thoát toàn màn hình
          </dt>
          <dd className="mt-1 text-base font-extrabold tabular-nums text-foreground">
            {summary.fullscreen_exit_count} lần
          </dd>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-2xs">
          <dt className="text-xs font-medium text-muted-foreground">
            Rời tab / Ẩn trang
          </dt>
          <dd className="mt-1 text-base font-extrabold tabular-nums text-foreground">
            {summary.page_hidden_count} lần
          </dd>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-2xs">
          <dt className="text-xs font-medium text-muted-foreground">
            Dữ liệu telemetry
          </dt>
          <dd className="mt-1 text-xs font-bold text-foreground">
            {summary.telemetry_complete
              ? "Thu thập đầy đủ"
              : "Gián đoạn / Không đầy đủ"}
          </dd>
        </div>
      </dl>

      {summary.review_reasons.length > 0 && (
        <div className="mt-4 rounded-xl border border-border/80 bg-card p-3">
          <p className="text-xs font-bold text-foreground">
            Lý do cần đối chiếu:
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
            {summary.review_reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-warning" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        * Tín hiệu giám sát là thông tin tham khảo để Consultant đối chiếu với
        video và bản ghi, không dùng để tự động đánh trượt hay đổi điểm bài thi.
      </p>
    </section>
  );
}
