import React from "react";
import { LessonDetailScreen } from "@/features/tutor-materials/components/LessonDetailScreen";

export const metadata = {
  title: "Chi tiết buổi học | BeeWise Tutor",
};

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <div className="container mx-auto p-1 md:p-2 max-w-6xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <LessonDetailScreen lessonId={resolvedParams.lessonId} />
    </div>
  );
}
