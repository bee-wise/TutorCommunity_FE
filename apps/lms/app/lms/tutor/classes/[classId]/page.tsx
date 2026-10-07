import type { Metadata } from "next";
import { ClassDetailScreen } from "@/features/tutor-classes/components/ClassDetailScreen";

export const metadata: Metadata = { title: "Chi tiết lớp học | BeeWise LMS" };
export default async function Page({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <ClassDetailScreen classId={classId} />;
}
