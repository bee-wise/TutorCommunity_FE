import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import type { AIAnalyzeRequest, Learner, LearningSession, TutorMaterial } from "../types";
import { LessonContextPanel } from "./LessonContextPanel";
import { TranscriptWorkspace } from "./TranscriptWorkspace";

interface LessonDetailCardProps {
  session: LearningSession;
  learner: Learner;
  materials: TutorMaterial[];
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onGenerate: (data: AIAnalyzeRequest) => void;
  errorMessage?: string;
}

export function LessonDetailCard({
  session,
  learner,
  materials,
  transcript,
  onTranscriptChange,
  onGenerate,
  errorMessage,
}: LessonDetailCardProps) {
  const learnerMaterialsHref = `/lms/tutor/materials/learner/${learner.id}`;
  const hasAiMaterial = materials.some((material) => material.source === "ai");

  return (
    <main className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href={learnerMaterialsHref}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          Thư viện của {learner.fullName}
        </Link>

        <header className="mt-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary">Chi tiết buổi học</p>
            <h1 className="mt-2 max-w-4xl font-nunito text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              {session.topic}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Kiểm tra bản ghi và chuẩn bị tài liệu ôn tập cho học viên sau buổi học.
            </p>
          </div>
          <span className="inline-flex h-9 w-fit shrink-0 items-center rounded-full border border-primary bg-card px-3 text-sm font-bold text-primary">
            {materials.length} tài liệu
          </span>
        </header>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(270px,340px)_minmax(0,1fr)] lg:gap-6">
          <LessonContextPanel
            session={session}
            learner={learner}
            materials={materials}
            learnerMaterialsHref={learnerMaterialsHref}
          />
          <TranscriptWorkspace
            session={session}
            hasAiMaterial={hasAiMaterial}
            transcript={transcript}
            onTranscriptChange={onTranscriptChange}
            onGenerate={onGenerate}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </main>
  );
}
