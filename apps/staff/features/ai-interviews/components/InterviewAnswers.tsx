"use client";

import { useState } from "react";
import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import {
  formatScore,
  questionNeedsReview,
} from "../utils/interview-presentation";
import { InterviewQuestion } from "./InterviewQuestion";
import { panelClass, ScoreBar } from "./InterviewUi";

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
    <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
      <nav
        aria-label="Chọn câu hỏi"
        className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:rounded-3xl lg:border lg:border-border lg:bg-card lg:p-2"
      >
        {data.questions.map((item) => {
          const active = question.q_code === item.q_code;
          const flagged = questionNeedsReview(item);
          return (
            <button
              key={item.q_code}
              type="button"
              aria-current={active}
              onClick={() => setCode(item.q_code)}
              className={`min-h-11 w-44 shrink-0 rounded-2xl border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] lg:w-full ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted lg:border-transparent"}`}
            >
              <span className="flex items-center justify-between gap-2 text-xs font-bold">
                <span>{item.q_code}</span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  {flagged && (
                    <span
                      className="size-2 rounded-full bg-accent"
                      aria-label="Cần xem lại"
                    />
                  )}
                  {formatScore(item.points)}/{item.max_points}
                </span>
              </span>
              <span className="mt-1 line-clamp-2 block text-xs leading-4 opacity-90">
                {item.title}
              </span>
              {!active && (
                <span className="mt-2 block">
                  <ScoreBar
                    value={item.points}
                    max={item.max_points}
                    flagged={flagged}
                  />
                </span>
              )}
            </button>
          );
        })}
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
