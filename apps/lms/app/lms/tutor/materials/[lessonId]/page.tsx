import { redirect, notFound } from "next/navigation";
import { CLASS_SESSIONS } from "@/features/tutor-materials/data/classroom.mock";
export const metadata = { title: "Chi tiết buổi học | BeeWise Tutor" };
export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const session = CLASS_SESSIONS.find((item) => item.id === lessonId);
  if (!session) notFound();
  redirect(`/lms/tutor/materials/classes/${session.classId}?session=${session.id}`);
}
