"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Flag } from "@phosphor-icons/react";
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
  return <div className="h-[100dvh] overflow-hidden bg-[#F8FAFC]"><div className="mx-auto flex h-full max-w-[1400px] flex-col gap-3 p-3 sm:p-4">
    <ExerciseWorkspaceHeader exercise={props.exercise} helperText="Câu trả lời được lưu tạm trong phiên này. Bạn có thể chuyển câu bất cứ lúc nào." />
    <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_250px] lg:grid-rows-1">
      <section className="order-2 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:order-1" aria-labelledby="current-question-title">
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold text-[#280F91]">Câu {props.currentQuestionIndex + 1} / {props.exercise.questions.length}</p><h2 id="current-question-title" className="mt-2 text-lg font-extrabold leading-7 text-slate-950">{props.currentQuestion.prompt}</h2><p className="mt-1 text-xs font-semibold text-slate-500">{props.currentQuestion.points} điểm</p></div><button type="button" onClick={() => props.onToggleFlag(props.currentQuestion.id)} aria-pressed={isFlagged} className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border ${isFlagged ? "border-[#FFC500] bg-[#FFF3CB] text-[#6D4A13]" : "border-border text-slate-500 hover:bg-slate-50"}`} aria-label={isFlagged ? "Bỏ đánh dấu câu hỏi" : "Đánh dấu câu hỏi"}><Flag size={18} weight={isFlagged ? "fill" : "regular"} /></button></div>
        <QuestionAnswer question={props.currentQuestion} answer={props.answers[props.currentQuestion.id] ?? ""} onChange={(answer) => props.onAnswer(props.currentQuestion.id, answer)} />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3"><button type="button" disabled={props.currentQuestionIndex === 0} onClick={() => props.onQuestionChange(props.currentQuestionIndex - 1)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-input px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 sm:px-4"><ArrowLeft size={16} weight="bold" /><span className="hidden sm:inline">Câu trước</span></button>{props.currentQuestionIndex < props.exercise.questions.length - 1 ? <button type="button" onClick={() => props.onQuestionChange(props.currentQuestionIndex + 1)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#280F91] px-3 text-sm font-bold text-white hover:bg-[#1F0B70] sm:px-4"><span className="hidden sm:inline">Câu tiếp</span><ArrowRight size={16} weight="bold" /></button> : <button type="button" onClick={() => setConfirmOpen(true)} className="h-10 rounded-xl bg-[#FFC500] px-4 text-sm font-extrabold text-[#302500] hover:bg-[#FADC76]">Hoàn thành bài</button>}</div>
      </section>
      <div className="order-1 min-h-0 space-y-2 lg:order-2 lg:overflow-y-auto"><QuestionNavigator questions={props.exercise.questions} answers={props.answers} flaggedQuestionIds={props.flaggedQuestionIds} currentIndex={props.currentQuestionIndex} onSelect={props.onQuestionChange} /><button type="button" onClick={() => setConfirmOpen(true)} className="h-10 w-full rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#1F0B70]">Nộp bài</button></div>
    </div>
  </div><SubmitExerciseDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Nộp bài tập?" description={unansweredCount > 0 ? `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn vẫn có thể nộp bài hoặc quay lại kiểm tra.` : "Bạn đã trả lời tất cả câu hỏi. Hãy nộp bài để xem kết quả và lời giải."} onConfirm={props.onSubmit} /></div>;
}

function QuestionAnswer({ question, answer, onChange }: { question: ExerciseQuestion; answer: string; onChange: (answer: string) => void }) {
  if (question.type === "short_answer") return <label className="mt-6 block"><span className="mb-2 block text-sm font-bold text-slate-700">Câu trả lời của bạn</span><input value={answer} onChange={(event) => onChange(event.target.value)} placeholder="Nhập đáp án..." className="h-12 w-full rounded-xl border border-input bg-[#F8FAFC] px-4 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" /></label>;
  return <fieldset className="mt-6 space-y-3"><legend className="sr-only">Chọn một đáp án</legend>{question.options?.map((option) => <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${answer === option.id ? "border-[#280F91] bg-[#EEF2FF]" : "border-border hover:bg-slate-50"}`}><input type="radio" name={question.id} value={option.id} checked={answer === option.id} onChange={() => onChange(option.id)} className="mt-1 accent-[#280F91]" /><span className="text-sm font-semibold leading-6 text-slate-800">{option.label}</span></label>)}</fieldset>;
}
