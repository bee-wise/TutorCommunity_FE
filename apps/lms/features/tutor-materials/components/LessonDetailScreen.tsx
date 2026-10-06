"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { LessonDetailCard } from "./LessonDetailCard";
import { GeneratingState } from "./GeneratingState";
import { SplitPreview } from "./SplitPreview";
import { MOCK_LEARNERS, MOCK_MATERIALS, MOCK_SESSIONS } from "../mockData";
import { useAIAnalyzeMutation } from "../hooks/useAnalyzeMutation";
import type { AIAnalyzeRequest, AIAnalyzeResponse } from "../types";

interface LessonDetailScreenProps {
  lessonId: string;
}

export const LessonDetailScreen = ({ lessonId }: LessonDetailScreenProps) => {
  const [aiResponse, setAiResponse] = useState<AIAnalyzeResponse | null>(null);
  const [transcript, setTranscript] = useState("");
  const mutation = useAIAnalyzeMutation();
  const session = MOCK_SESSIONS.find((item) => item.id === lessonId);
  const learner = MOCK_LEARNERS.find((item) => item.id === session?.learnerId);
  const materials = MOCK_MATERIALS.filter((item) => item.sessionId === lessonId);

  const handleGenerate = (data: AIAnalyzeRequest) => {
    mutation.mutate(data, {
      onSuccess: setAiResponse,
      onError: (error) => {
        toast.error("Không thể tạo tài liệu", { description: error.message });
      },
    });
  };

  if (!session || !learner) {
    return (
      <div className="grid min-h-[60dvh] place-items-center bg-background px-4 text-center">
        <div className="max-w-sm">
          <WarningCircle size={36} className="mx-auto text-warning" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-extrabold text-foreground">Không tìm thấy buổi học</h1>
          <p className="mt-2 text-sm text-muted-foreground">Buổi học này không có trong danh sách tài liệu hiện tại.</p>
          <Link href="/lms/tutor/materials" className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Về danh sách tài liệu</Link>
        </div>
      </div>
    );
  }

  if (aiResponse) {
    return (
      <div className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <button
            type="button"
            onClick={() => setAiResponse(null)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            Quay lại buổi học
          </button>
          <SplitPreview data={aiResponse} />
        </div>
      </div>
    );
  }

  if (mutation.isPending) {
    return <GeneratingState />;
  }

  return (
    <LessonDetailCard
      key={session.id}
      session={session}
      learner={learner}
      materials={materials}
      transcript={transcript}
      onTranscriptChange={setTranscript}
      onGenerate={handleGenerate}
      errorMessage={mutation.error?.message}
    />
  );
};
