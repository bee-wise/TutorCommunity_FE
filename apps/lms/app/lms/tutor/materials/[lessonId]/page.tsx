import { LessonDetailScreen } from "@/features/tutor-materials/components/LessonDetailScreen";

export const metadata = {
  title: "Chi tiết buổi học | BeeWise Tutor",
};

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { lessonId } = await params;
  return <LessonDetailScreen key={lessonId} lessonId={lessonId} />;
}
