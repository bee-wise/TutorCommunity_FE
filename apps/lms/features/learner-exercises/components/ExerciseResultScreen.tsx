import Link from "next/link";
import { ArrowCounterClockwise, ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import type {
  ExerciseQuestion,
  ExerciseResultSummary,
  LearnerExercise,
} from "../types/learner-exercises.types";
import { getExerciseSessionHref, normalizeExerciseAnswer } from "../utils/learner-exercises.utils";

export function ExerciseResultScreen({ exercise, answers, result, onRetry }: { exercise: LearnerExercise; answers: Record<string, string>; result: ExerciseResultSummary; onRetry: () => void }) {
  const message = result.percentage >= 80 ? "Bạn nắm bài khá chắc rồi" : result.percentage >= 60 ? "Bạn đang đi đúng hướng" : "Mình cùng ôn lại một chút nhé";
  return <div className="min-h-full bg-[#F8FAFC]"><div className="mx-auto max-w-[900px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <Link href={getExerciseSessionHref(exercise)} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline"><ArrowLeft size={17} weight="bold" />Bài tập của buổi học</Link>
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"><div className="bg-[#FFF9E8] px-5 py-6 text-center sm:px-8"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#DDF1E5] text-[#365D43]"><CheckCircle size={27} weight="fill" /></span><h1 className="mt-3 text-2xl font-extrabold text-slate-950">{message}</h1><p className="mt-1 text-sm text-slate-600">{exercise.title}</p><p className="mt-4 text-4xl font-extrabold text-[#280F91]">{result.earnedPoints}/{result.totalPoints}</p><p className="mt-1 text-sm font-bold text-slate-500">{result.correctCount}/{result.questionCount} câu đúng</p></div><div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-center"><button type="button" onClick={onRetry} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#280F91]/20 px-4 text-sm font-bold text-[#280F91] hover:bg-[#EEF2FF]"><ArrowCounterClockwise size={17} weight="bold" />Làm lại</button><Link href={getExerciseSessionHref(exercise)} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#1F0B70]">Về bài tập của buổi học</Link></div></section>
    <section className="space-y-3" aria-labelledby="answer-review-title"><h2 id="answer-review-title" className="text-lg font-extrabold text-slate-950">Xem lại đáp án</h2>{exercise.questions.map((question, index) => <AnswerReview key={question.id} question={question} answer={answers[question.id] ?? ""} index={index} />)}</section>
  </div></div>;
}

function AnswerReview({ question, answer, index }: { question: ExerciseQuestion; answer: string; index: number }) {
  const correct = normalizeExerciseAnswer(answer) === normalizeExerciseAnswer(question.correctAnswer);
  const optionLabel = (value: string) => question.options?.find((option) => option.id === value)?.label ?? value;
  return <article className={`rounded-2xl border bg-white p-4 sm:p-5 ${correct ? "border-[#B8D9C3]" : "border-[#E1ABA7]"}`}><div className="flex items-start gap-3">{correct ? <CheckCircle className="mt-0.5 shrink-0 text-[#447353]" size={21} weight="fill" /> : <XCircle className="mt-0.5 shrink-0 text-[#A24840]" size={21} weight="fill" />}<div className="min-w-0"><h3 className="font-extrabold leading-6 text-slate-950">Câu {index + 1}: {question.prompt}</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-xs text-slate-500">Bạn trả lời</dt><dd className={`mt-0.5 font-bold ${correct ? "text-[#365D43]" : "text-[#8A3730]"}`}>{answer ? optionLabel(answer) : "Chưa trả lời"}</dd></div>{!correct ? <div><dt className="text-xs text-slate-500">Đáp án đúng</dt><dd className="mt-0.5 font-bold text-[#365D43]">{optionLabel(question.correctAnswer)}</dd></div> : null}</dl><p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-600">{question.explanation}</p></div></div></article>;
}
