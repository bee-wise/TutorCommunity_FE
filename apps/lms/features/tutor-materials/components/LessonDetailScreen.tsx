"use client";

import React, { useState } from "react";
import { LessonDetailCard } from "./LessonDetailCard";
import { GeneratingState } from "./GeneratingState";
import { SplitPreview } from "./SplitPreview";
import { MOCK_LESSONS } from "../mockData";
import { useAIAnalyzeMutation } from "../hooks/useAnalyzeMutation";
import { AIAnalyzeResponse } from "../types";

interface LessonDetailScreenProps {
  lessonId: string;
}

export const LessonDetailScreen = ({ lessonId }: LessonDetailScreenProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratingState, setShowGeneratingState] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIAnalyzeResponse | null>(null);

  const mutation = useAIAnalyzeMutation();

  // Tìm lesson dựa vào params, fallback về mock đầu tiên
  const lesson =
    MOCK_LESSONS.find((l: any) => l.id === lessonId) || MOCK_LESSONS[0];

  const handleGenerate = (data: {
    transcript: string;
    subject: string;
    num_questions: number;
  }) => {
    setIsGenerating(true);
    // Add small delay before showing the full generating state UI for smoother UX
    setTimeout(() => {
      setShowGeneratingState(true);

      mutation.mutate(data, {
        onSuccess: (responseData) => {
          // Lưu response và hiển thị SplitPreview ngay tại trang này để không mất state
          setAiResponse(responseData);
          setShowGeneratingState(false);
          setIsGenerating(false);
        },
        onError: (error) => {
          console.error("API Error:", error);
          alert("Có lỗi xảy ra khi tạo tài liệu: " + error.message);
          setShowGeneratingState(false);
          setIsGenerating(false);
        },
      });
    }, 800);
  };

  // Nếu đã có response, hiển thị màn hình Preview
  if (aiResponse) {
    return <SplitPreview data={aiResponse} lessonId={lessonId} />;
  }

  // Trong lúc đợi gọi API
  if (showGeneratingState) {
    return <GeneratingState />;
  }

  // Màn hình chi tiết ban đầu
  return (
    <LessonDetailCard
      lesson={lesson}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
    />
  );
};
