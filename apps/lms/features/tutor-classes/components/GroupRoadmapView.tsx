"use client";

import { useState } from "react";
import { Bars3BottomLeftIcon, MapIcon } from "@heroicons/react/24/outline";
import { LearningPath, type LearningPathStage } from "@workspace/ui/components/ui/learning-path";

type Mode = "visual" | "text";
const modes = [
  { id: "visual", label: "Trực quan", icon: MapIcon },
  { id: "text", label: "Văn bản", icon: Bars3BottomLeftIcon },
] as const;

function RoadmapText({ stages }: { stages: readonly LearningPathStage[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {stages.map((stage, idx) => (
        <div key={stage.id} className="space-y-2 rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-card px-2 py-0.5 font-mono text-[10px] font-extrabold text-primary shadow-2xs">Chặng {idx + 1}</span>
            <h4 className="font-lms text-sm font-extrabold text-foreground">{stage.title}</h4>
          </div>
          {stage.objective && <p className="text-xs text-muted-foreground">{stage.objective}</p>}
          <ol className="mt-2 space-y-1.5 border-t border-border/60 pt-2">
            {stage.lessons.map((lesson, i) => (
              <li key={lesson.id} className="flex gap-2 text-xs font-medium text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block [overflow-wrap:anywhere]">{lesson.title}</span>
                  {lesson.content && <span className="mt-0.5 block whitespace-pre-line font-normal text-muted-foreground [overflow-wrap:anywhere]">{lesson.content}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export function GroupRoadmapView({ stages }: { stages: readonly LearningPathStage[] }) {
  const [mode, setMode] = useState<Mode>("visual");
  return (
    <div className="space-y-4">
      <div role="group" aria-label="Cách xem lộ trình" className="inline-flex rounded-xl border border-border bg-card p-1">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${mode === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      {mode === "visual" ? <LearningPath stages={stages} /> : <RoadmapText stages={stages} />}
    </div>
  );
}
