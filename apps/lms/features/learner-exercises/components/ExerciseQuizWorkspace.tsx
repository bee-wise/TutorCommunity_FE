"use client";

import { useState } from "react";
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, FlagIcon as Flag } from "@heroicons/react/24/outline";
import type {
  ExerciseQuestion,
  LearnerExercise,
} from "../types/learner-exercises.types";
import { ExerciseWorkspaceHeader } from "./ExerciseWorkspaceHeader";
import { QuestionNavigator } from "./QuestionNavigator";
import { SubmitExerciseDialog } from "./SubmitExerciseDialog";

interface ExerciseQuizWorkspaceProps {
  exercise: LearnerExercise;
  answers: Record<string, string>;
  flaggedQuestionIds: Set<string>;
  currentQuestionIndex: number;
  currentQuestion: ExerciseQuestion;
  answeredCount: number;
  onAnswer: (questionId: string, answer: string) => void;
  onToggleFlag: (questionId: string) => void;
  onQuestionChange: (index: number) => void;
  onSubmit: () => void;
}

export function ExerciseQuizWorkspace(props: ExerciseQuizWorkspaceProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const unansweredCount = props.exercise.questions.length - props.answeredCount;
  const isFlagged = props.flaggedQuestionIds.has(props.currentQuestion.id);
  return <div className="h-[100dvh] overflow-hidden bg-muted"><div className="mx-auto flex h-full max-w-[1400px] flex-col gap-3 p-3 sm:p-4">
    <ExerciseWorkspaceHeader exercise={props.exercise} helperText="Câu trả lời được lưu tạm trong phiên này. Bạn có thể chuyển câu bất cứ lúc nào." />
    <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_250px] lg:grid-rows-1">
      <section className="order-2 flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft lg:order-1" aria-labelledby="current-question-title">
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold text-primary">Câu {props.currentQuestionIndex + 1} / {props.exercise.questions.length}</p><h2 id="current-question-title" className="mt-2 text-lg font-extrabold leading-7 text-foreground">{props.currentQuestion.prompt}</h2><p className="mt-1 text-xs font-semibold text-muted-foreground">{props.currentQuestion.points} điểm</p></div><button type="button" onClick={() => props.onToggleFlag(props.currentQuestion.id)} aria-pressed={isFlagged} className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border ${isFlagged ? "border-accent bg-accent/15 text-warning" : "border-border text-muted-foreground hover:bg-muted"}`} aria-label={isFlagged ? "Bỏ đánh dấu câu hỏi" : "Đánh dấu câu hỏi"}><Flag width={18} height={18} fill={isFlagged ? "currentColor" : "none"} /></button></div>
        <QuestionAnswer question={props.currentQuestion} answer={props.answers[props.currentQuestion.id] ?? ""} onChange={(answer) => props.onAnswer(props.currentQuestion.id, answer)} />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3"><button type="button" disabled={props.currentQuestionIndex === 0} onClick={() => props.onQuestionChange(props.currentQuestionIndex - 1)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-input px-3 text-sm font-bold text-foreground hover:bg-muted disabled:opacity-40 sm:px-4"><ArrowLeft width={16} height={16} /><span className="hidden sm:inline">Câu trước</span></button>{props.currentQuestionIndex < props.exercise.questions.length - 1 ? <button type="button" onClick={() => props.onQuestionChange(props.currentQuestionIndex + 1)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 sm:px-4"><span className="hidden sm:inline">Câu tiếp</span><ArrowRight width={16} height={16} /></button> : <button type="button" onClick={() => setConfirmOpen(true)} className="h-10 rounded-xl bg-accent px-4 text-sm font-extrabold text-accent-foreground hover:bg-highlight">Hoàn thành bài</button>}</div>
      </section>
      <div className="order-1 min-h-0 space-y-2 lg:order-2 lg:overflow-y-auto"><QuestionNavigator questions={props.exercise.questions} answers={props.answers} flaggedQuestionIds={props.flaggedQuestionIds} currentIndex={props.currentQuestionIndex} onSelect={props.onQuestionChange} /><button type="button" onClick={() => setConfirmOpen(true)} className="h-10 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90">Nộp bài</button></div>
    </div>
  </div><SubmitExerciseDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Nộp bài tập?" description={unansweredCount > 0 ? `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn vẫn có thể nộp bài hoặc quay lại kiểm tra.` : "Bạn đã trả lời tất cả câu hỏi. Hãy nộp bài để xem kết quả và lời giải."} onConfirm={props.onSubmit} /></div>;
}

function QuestionAnswer({ question, answer, onChange }: { question: ExerciseQuestion; answer: string; onChange: (answer: string) => void }) {
  if (question.type === "short_answer") return <label className="mt-6 block"><span className="mb-2 block text-sm font-bold text-foreground">Câu trả lời của bạn</span><input value={answer} onChange={(event) => onChange(event.target.value)} placeholder="Nhập đáp án..." className="h-12 w-full rounded-xl border border-input bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>;
  return <fieldset className="mt-6 space-y-3"><legend className="sr-only">Chọn một đáp án</legend>{question.options?.map((option) => <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${answer === option.id ? "border-primary bg-muted" : "border-border hover:bg-muted"}`}><input type="radio" name={question.id} value={option.id} checked={answer === option.id} onChange={() => onChange(option.id)} className="peer sr-only" /><span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full border-2 border-input bg-card transition-all peer-checked:border-[5px] peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2" /><span className="text-sm font-semibold leading-6 text-foreground">{option.label}</span></label>)}</fieldset>;
}
