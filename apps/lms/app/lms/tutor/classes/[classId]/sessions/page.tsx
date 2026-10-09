import type { Metadata } from "next";
import { ClassSessionsScreen } from "@/features/tutor-classes/components/ClassSessionsScreen";

export const metadata: Metadata = { title: "Buổi học & điểm danh | BeeWise LMS" };
export default async function Page({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <ClassSessionsScreen key={classId} classId={classId} />;
}
