import type { Metadata } from "next";
import { ClassMembersScreen } from "@/features/tutor-classes/components/ClassMembersScreen";

export const metadata: Metadata = { title: "Thành viên lớp | BeeWise LMS" };
export default async function Page({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <ClassMembersScreen key={classId} classId={classId} />;
}
