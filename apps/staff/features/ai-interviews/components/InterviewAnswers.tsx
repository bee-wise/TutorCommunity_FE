"use client";

import { useState } from "react";
import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { Button } from "@workspace/ui/components/ui/button";
import { questionNeedsReview } from "../utils/interview-presentation";
import { InterviewQuestion } from "./InterviewQuestion";
import { actionClass, panelClass } from "./InterviewUi";

export function InterviewAnswers({
  data,
  canOverride,
}: {
  data: InterviewPackage;
  canOverride: boolean;
}) {
  const [code, setCode] = useState(data.questions[0]?.q_code ?? "");
  const question =
    data.questions.find((item) => item.q_code === code) ?? data.questions[0];
  if (!question)
    return <p className={panelClass}>Chưa có câu trả lời để xem.</p>;
  return (
    <div className="space-y-4">
      <nav
        aria-label="Chọn câu hỏi"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {data.questions.map((item) => (
          <Button
            key={item.q_code}
            variant={question.q_code === item.q_code ? "default" : "outline"}
            aria-pressed={question.q_code === item.q_code}
            className={`shrink-0 ${actionClass}`}
            onClick={() => setCode(item.q_code)}
          >
            {item.q_code}
            <span className="tabular-nums">
              {item.points ?? "—"}/{item.max_points}
            </span>
            {questionNeedsReview(item) && (
              <span
                className="size-2 rounded-full bg-accent"
                aria-label="Cần xem lại"
              />
            )}
          </Button>
        ))}
      </nav>
      <InterviewQuestion
        key={question.q_code}
        question={question}
        interviewId={data.interview.interview_id}
        canOverride={canOverride}
      />
    </div>
  );
}
