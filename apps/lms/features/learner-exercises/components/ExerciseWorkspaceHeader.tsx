"use client";

import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Popover } from "radix-ui";
import { Button } from "@workspace/ui/components/ui/button";
import type { LearnerExercise } from "../types/learner-exercises.types";
import { formatExerciseDate, getExerciseSessionHref } from "../utils/learner-exercises.utils";
import { ExerciseBadges } from "./ExerciseBadges";

export function ExerciseWorkspaceHeader({ exercise, helperText }: { exercise: LearnerExercise; helperText: string }) {
  return (
    <header className="relative flex h-16 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-3 shadow-sm sm:px-4">
      <Button asChild variant="ghost" size="icon" className="size-11 shrink-0 text-primary hover:bg-muted"><Link href={getExerciseSessionHref(exercise)} aria-label="Quay lại bài tập của buổi học"><ArrowLeftIcon className="size-[18px]" aria-hidden="true" /></Link></Button>
      <div className="min-w-0 flex-1"><h1 className="truncate text-sm font-extrabold text-primary sm:text-base">{exercise.title}</h1><p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">{exercise.className} · {exercise.lessonTopic}</p></div>
      <div className="hidden shrink-0 lg:block"><ExerciseBadges source={exercise.source} status={exercise.status} difficulty={exercise.difficulty} /></div>
      <Popover.Root>
        <Popover.Trigger asChild><Button variant="outline" size="icon" className="size-11 shrink-0" aria-label="Xem thông tin bài tập"><InformationCircleIcon className="size-[18px]" aria-hidden="true" /></Button></Popover.Trigger>
        <Popover.Portal><Popover.Content data-slot="popover-content" align="end" sideOffset={8} collisionPadding={16} className="z-50 w-[min(340px,calc(100vw-2rem))] rounded-3xl border border-border bg-card p-5 shadow-soft">
          <ExerciseBadges source={exercise.source} status={exercise.status} difficulty={exercise.difficulty} />
          <h2 className="mt-4 text-sm font-extrabold text-foreground">Thông tin bài tập</h2><p className="mt-1.5 text-sm leading-6 text-muted-foreground">{exercise.description}</p>
          <dl className="mt-4 grid gap-3 text-xs"><div><dt className="text-muted-foreground">Gia sư</dt><dd className="mt-1 font-bold">{exercise.tutorName}</dd></div><div><dt className="text-muted-foreground">Hạn hoàn thành</dt><dd className="mt-1 font-bold">{formatExerciseDate(exercise.dueAt)}</dd></div><div><dt className="text-muted-foreground">Thời gian dự kiến</dt><dd className="mt-1 font-bold">{exercise.estimatedMinutes} phút</dd></div></dl>
          <p className="mt-4 rounded-xl bg-accent/15 px-3 py-2.5 text-xs font-medium leading-5 text-warning">{helperText}</p>
        </Popover.Content></Popover.Portal>
      </Popover.Root>
    </header>
  );
}
