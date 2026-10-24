import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { formatScore } from "../utils/interview-presentation";
import { Chip, panelClass, ScoreBar } from "./InterviewUi";

export function InterviewScoreBreakdown({
  summary,
}: {
  summary: NonNullable<InterviewPackage["summary"]>;
}) {
  return (
    <section className={panelClass}>
      <h2 className="font-nunito text-lg font-extrabold">Điểm theo câu hỏi</h2>
      <ul className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
        {summary.questions.map((item) => (
          <li key={item.q_code}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm leading-5">
                <span className="mr-2 font-bold text-primary">
                  {item.q_code}
                </span>
                {item.title}
              </p>
              {item.points == null ? (
                <Chip tone="flag">Chưa chấm</Chip>
              ) : (
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {formatScore(item.points)}
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / {item.max_points}
                  </span>
                </span>
              )}
            </div>
            <ScoreBar
              value={item.points}
              max={item.max_points}
              flagged={item.points == null}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
