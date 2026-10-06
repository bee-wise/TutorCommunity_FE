"use client";

import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { CaretDown, CheckCircle, Lightbulb } from "@phosphor-icons/react";
import type { AIAnalyzeResponse } from "../types";

export function DocumentRenderer({ data }: { data: AIAnalyzeResponse }) {
  return (
    <article className="space-y-8 text-base leading-relaxed text-foreground [overflow-wrap:anywhere]">
      <header>
        <h2 className="text-2xl leading-[1.25] text-primary sm:text-3xl">{data.summary.title}</h2>
        <div className="mt-4"><Latex>{data.summary.overview}</Latex></div>
      </header>

      {data.summary.prerequisites.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl text-primary">Kiến thức cần nhớ</h2>
          <ul className="list-disc space-y-2 pl-5">
            {data.summary.prerequisites.map((item, index) => (
              <li key={index}><Latex>{item}</Latex></li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-5" aria-label="Nội dung lý thuyết">
        {data.summary.key_concepts.map((concept, index) => (
          <div key={index} className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-xl leading-[1.25] text-primary">{concept.name}</h2>
            <p><Latex>{concept.explanation}</Latex></p>
            {concept.formulas.map((formula, formulaIndex) => (
              <div key={formulaIndex}>
                <div className="overflow-x-auto py-3 text-center">
                  <Latex>{`$$${formula.latex}$$`}</Latex>
                </div>
                <p className="text-sm text-muted-foreground"><Latex>{formula.description}</Latex></p>
              </div>
            ))}
          </div>
        ))}
      </section>

      {data.quiz.multiple_choice.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl text-primary">Bài tập trắc nghiệm</h2>
          {data.quiz.multiple_choice.map((question, index) => (
            <div key={index} className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
              <p>
                <strong className="text-primary">Câu {index + 1}: </strong>
                <Latex>{question.question}</Latex>
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <li key={option.label} className="rounded-2xl border border-border p-3">
                    <strong>{option.label}. </strong>
                    <Latex>{option.content}</Latex>
                  </li>
                ))}
              </ul>
              <details className="group mt-4 overflow-hidden rounded-2xl border border-border/80 bg-muted/20 transition-all hover:border-primary/40">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-nunito text-sm font-extrabold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                      <Lightbulb size={16} weight="bold" />
                    </span>
                    <span>Đáp án & giải thích</span>
                  </span>
                  <CaretDown
                    size={16}
                    weight="bold"
                    className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="border-t border-border/60 bg-card/60 p-4 pt-3.5 text-sm">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-secondary/15 px-3 py-1.5 font-bold text-secondary">
                    <span>Đáp án đúng:</span>
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {question.correct_answer}
                    </span>
                  </div>
                  <div className="mt-3 leading-relaxed text-foreground">
                    <Latex>{question.explanation}</Latex>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </section>
      )}

      {data.quiz.exercises.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl text-primary">Bài tập tự luận</h2>
          {data.quiz.exercises.map((exercise, index) => (
            <div key={index} className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
              <p>
                <strong className="text-primary">Bài {index + 1}: </strong>
                <Latex>{exercise.problem}</Latex>
              </p>
              <details className="group mt-4 overflow-hidden rounded-2xl border border-border/80 bg-muted/20 transition-all hover:border-primary/40">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-nunito text-sm font-extrabold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CheckCircle size={16} weight="bold" />
                    </span>
                    <span>Xem lời giải chi tiết</span>
                  </span>
                  <CaretDown
                    size={16}
                    weight="bold"
                    className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="space-y-3.5 border-t border-border/60 bg-card/60 p-4 pt-3.5 text-sm">
                  <ol className="space-y-2.5 divide-y divide-border/40">
                    {exercise.solution_steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="pt-2.5 first:pt-0">
                        <span className="font-bold text-primary">Bước {step.step_number}: </span>
                        <Latex>{step.description}</Latex>
                      </li>
                    ))}
                  </ol>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-secondary/15 px-3 py-1.5 font-bold text-secondary">
                    <span>Kết quả:</span>
                    <Latex>{exercise.final_answer}</Latex>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
