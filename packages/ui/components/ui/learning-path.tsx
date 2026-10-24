"use client";

import Image from "next/image";
import { CheckIcon, PlayIcon } from "@heroicons/react/20/solid";
import { cn } from "@workspace/core/helpers/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip";

export interface LearningPathLesson {
  id: string;
  title: string;
  content?: string | null;
}
export interface LearningPathStage {
  id: string;
  title: string;
  objective?: string | null;
  lessons: LearningPathLesson[];
}
export interface LearningPathProps {
  stages: readonly LearningPathStage[];
  /** With progress data, nodes show done / current / upcoming. Omit for a plain preview. */
  completedLessonIds?: readonly string[];
  currentLessonId?: string;
  onLessonSelect?: (lesson: LearningPathLesson, stage: LearningPathStage) => void;
  className?: string;
}

const LOGO_MARK = "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_96/v1789964842/Logo_1.png";
const BEE_CHEER = "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_320/v1789966161/20.png";
const ROW = 112;
const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
// Horizontal centre of each node in a repeating wave, in % of the path width.
const WAVE = [50, 61, 67, 61, 50, 39, 33, 39];
const xOf = (index: number) => WAVE[index % WAVE.length]!;

type NodeState = "plain" | "done" | "current" | "upcoming";

function Hexagon({ state, number }: { state: NodeState; number: number }) {
  const face =
    state === "done"
      ? "bg-secondary text-secondary-foreground"
      : state === "upcoming"
        ? "bg-muted text-muted-foreground"
        : "bg-primary text-primary-foreground";
  const edge = state === "done" ? "bg-foreground" : state === "upcoming" ? "bg-border" : "bg-ring";
  return (
    <span className="relative block size-16">
      <span aria-hidden="true" className={cn("absolute inset-0 translate-y-1.5", edge)} style={{ clipPath: HEX }} />
      <span
        className={cn("absolute inset-0 grid place-items-center font-lms text-lg font-extrabold tabular-nums", face)}
        style={{ clipPath: HEX }}
      >
        {state === "done" ? (
          <CheckIcon className="size-7" aria-hidden="true" />
        ) : state === "current" ? (
          <PlayIcon className="size-6" aria-hidden="true" />
        ) : (
          number
        )}
      </span>
    </span>
  );
}

function StagePath({
  stage,
  stageNumber,
  states,
  onLessonSelect,
}: {
  stage: LearningPathStage;
  stageNumber: number;
  states: NodeState[];
  onLessonSelect?: LearningPathProps["onLessonSelect"];
}) {
  const count = stage.lessons.length;
  const point = (i: number) => ({ x: xOf(i), y: i * ROW + ROW / 2 });
  return (
    <div className="relative" style={{ height: count * ROW }}>
      <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 100 ${count * ROW}`} preserveAspectRatio="none">
        {stage.lessons.slice(1).map((lesson, k) => {
          const a = point(k);
          const b = point(k + 1);
          const reached = states[k] === "done";
          return (
            <path
              key={lesson.id}
              d={`M ${a.x} ${a.y} C ${a.x} ${a.y + ROW / 2}, ${b.x} ${b.y - ROW / 2}, ${b.x} ${b.y}`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeWidth={reached ? 6 : 4}
              strokeDasharray={reached ? undefined : "2 10"}
              className={reached ? "stroke-secondary" : "stroke-border"}
            />
          );
        })}
      </svg>
      {stage.lessons.map((lesson, i) => {
        const x = xOf(i);
        const top = i * ROW + ROW / 2;
        const onRight = x >= 50;
        const state = states[i]!;
        return (
          <div key={lesson.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`Chặng ${stageNumber}, bài ${i + 1}: ${lesson.title}`}
                  aria-current={state === "current" ? "step" : undefined}
                  onClick={() => onLessonSelect?.(lesson, stage)}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl outline-none transition-transform duration-300 ease-[var(--ease-soft)] hover:-translate-y-[55%] focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none",
                    !onLessonSelect && "cursor-default",
                  )}
                  style={{ left: `${x}%`, top }}
                >
                  {state === "current" && (
                    <span aria-hidden="true" className="absolute -inset-2 rounded-full border-2 border-accent motion-safe:animate-pulse" />
                  )}
                  <Hexagon state={state} number={i + 1} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs space-y-1 rounded-xl px-3 py-2">
                <p className="font-bold">{lesson.title}</p>
                {lesson.content && <p className="line-clamp-6 whitespace-pre-line opacity-90">{lesson.content}</p>}
              </TooltipContent>
            </Tooltip>
            <p
              className={cn(
                "pointer-events-none absolute -translate-y-1/2 text-xs font-bold leading-4 text-foreground",
                onRight ? "text-left" : "text-right",
                state === "upcoming" && "text-muted-foreground",
              )}
              style={onRight ? { left: `calc(${x}% + 3.25rem)`, right: 0, top } : { right: `calc(${100 - x}% + 3.25rem)`, left: 0, top }}
            >
              <span className="line-clamp-2">{lesson.title}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function LearningPath({ stages, completedLessonIds, currentLessonId, onLessonSelect, className }: LearningPathProps) {
  const done = new Set(completedLessonIds);
  const tracked = completedLessonIds !== undefined || currentLessonId !== undefined;
  const firstOpen = stages.flatMap((s) => s.lessons).find((l) => !done.has(l.id))?.id;
  const current = currentLessonId ?? firstOpen;
  const total = stages.reduce((sum, s) => sum + s.lessons.length, 0);
  const finished = tracked && total > 0 && done.size >= total;
  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("mx-auto w-full max-w-xl space-y-2", className)}>
        <div className="flex justify-center">
          <span className="rounded-full border border-border bg-card px-4 py-1 text-xs font-extrabold text-primary shadow-soft">Bắt đầu lộ trình</span>
        </div>
        {stages.map((stage, s) => {
          const states: NodeState[] = stage.lessons.map((l) =>
            !tracked ? "plain" : done.has(l.id) ? "done" : l.id === current ? "current" : "upcoming",
          );
          const doneCount = states.filter((x) => x === "done").length;
          return (
            <section key={stage.id} aria-label={`Chặng ${s + 1}: ${stage.title}`} className="space-y-3 pt-4">
              <header className="flex items-center gap-4 rounded-3xl bg-primary p-4 text-primary-foreground shadow-soft sm:p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card">
                  <Image src={LOGO_MARK} alt="" width={36} height={36} className="size-9 object-contain" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-wide opacity-80">Chặng {s + 1}</p>
                  <h3 className="font-lms text-lg font-extrabold leading-[1.25] [overflow-wrap:anywhere]">{stage.title}</h3>
                  {stage.objective && <p className="mt-1 text-sm opacity-90 [overflow-wrap:anywhere]">{stage.objective}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-extrabold tabular-nums text-accent-foreground">
                  {tracked ? `${doneCount}/${stage.lessons.length}` : stage.lessons.length} bài
                </span>
              </header>
              {stage.lessons.length > 0 ? (
                <StagePath stage={stage} stageNumber={s + 1} states={states} onLessonSelect={onLessonSelect} />
              ) : (
                <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground">Chặng này chưa có bài học.</p>
              )}
            </section>
          );
        })}
        <div className="flex flex-col items-center gap-2 pt-4 text-center">
          <Image src={BEE_CHEER} alt="" width={120} height={120} className="h-24 w-auto object-contain" />
          <p className="font-lms text-sm font-extrabold text-foreground">{finished ? "Hoàn thành lộ trình, tuyệt vời!" : "Đích đến: hoàn thành lộ trình"}</p>
        </div>
      </div>
    </TooltipProvider>
  );
}
