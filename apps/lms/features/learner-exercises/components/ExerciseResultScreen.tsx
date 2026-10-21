import Link from "next/link";
import { ArrowPathIcon as ArrowCounterClockwise, ArrowLeftIcon as ArrowLeft, CheckCircleIcon as CheckCircle, XCircleIcon as XCircle } from "@heroicons/react/24/outline";
import type {
  ExerciseQuestion,
  ExerciseResultSummary,
  LearnerExercise,
} from "../types/learner-exercises.types";
import { getExerciseSessionHref, normalizeExerciseAnswer } from "../utils/learner-exercises.utils";

export function ExerciseResultScreen({ exercise, answers, result, onRetry }: { exercise: LearnerExercise; answers: Record<string, string>; result: ExerciseResultSummary; onRetry: () => void }) {
  const message = result.percentage >= 80 ? "Bạn nắm bài khá chắc rồi" : result.percentage >= 60 ? "Bạn đang đi đúng hướng" : "Mình cùng ôn lại một chút nhé";
  return <div className="min-h-full bg-muted"><div className="mx-auto max-w-[900px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <Link href={getExerciseSessionHref(exercise)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-muted active:scale-[0.98]"><ArrowLeft width={17} height={17} />Bài tập của buổi học</Link>
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"><div className="bg-accent/15 px-5 py-6 text-center sm:px-8"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-secondary/15 text-foreground"><CheckCircle width={27} height={27} /></span><h1 className="mt-3 text-2xl font-extrabold text-primary">{message}</h1><p className="mt-1 text-sm text-muted-foreground">{exercise.title}</p><p className="mt-4 text-4xl font-extrabold text-primary">{result.earnedPoints}/{result.totalPoints}</p><p className="mt-1 text-sm font-bold text-muted-foreground">{result.correctCount}/{result.questionCount} câu đúng</p></div><div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-center"><button type="button" onClick={onRetry} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 px-4 text-sm font-bold text-primary hover:bg-muted"><ArrowCounterClockwise width={17} height={17} />Làm lại</button><Link href={getExerciseSessionHref(exercise)} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90">Về bài tập của buổi học</Link></div></section>
    <section className="space-y-3" aria-labelledby="answer-review-title"><h2 id="answer-review-title" className="text-lg font-extrabold text-foreground">Xem lại đáp án</h2>{exercise.questions.map((question, index) => <AnswerReview key={question.id} question={question} answer={answers[question.id] ?? ""} index={index} />)}</section>
  </div></div>;
}

function AnswerReview({ question, answer, index }: { question: ExerciseQuestion; answer: string; index: number }) {
  const correct = normalizeExerciseAnswer(answer) === normalizeExerciseAnswer(question.correctAnswer);
  const optionLabel = (value: string) => question.options?.find((option) => option.id === value)?.label ?? value;
  return <article className={`rounded-2xl border bg-card p-4 sm:p-5 ${correct ? "border-secondary/30" : "border-error"}`}><div className="flex items-start gap-3">{correct ? <CheckCircle className="mt-0.5 shrink-0 text-foreground" width={21} height={21} /> : <XCircle className="mt-0.5 shrink-0 text-destructive" width={21} height={21} />}<div className="min-w-0"><h3 className="font-extrabold leading-6 text-foreground">Câu {index + 1}: {question.prompt}</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-xs text-muted-foreground">Bạn trả lời</dt><dd className={`mt-0.5 font-bold ${correct ? "text-foreground" : "text-destructive"}`}>{answer ? optionLabel(answer) : "Chưa trả lời"}</dd></div>{!correct ? <div><dt className="text-xs text-muted-foreground">Đáp án đúng</dt><dd className="mt-0.5 font-bold text-foreground">{optionLabel(question.correctAnswer)}</dd></div> : null}</dl><p className="mt-3 rounded-xl bg-muted px-3 py-2.5 text-sm leading-6 text-muted-foreground">{question.explanation}</p></div></div></article>;
}
