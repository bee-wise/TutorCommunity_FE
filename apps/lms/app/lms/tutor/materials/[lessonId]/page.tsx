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
    <div className="container mx-auto p-4 max-w-7xl h-[calc(100vh-8rem)] flex flex-col">
      <LessonDetailScreen lessonId={resolvedParams.lessonId} />
    </div>
  );
}
