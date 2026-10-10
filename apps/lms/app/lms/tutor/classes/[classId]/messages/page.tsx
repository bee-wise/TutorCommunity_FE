import type { Metadata } from "next";
import { ClassChatScreen } from "@/features/tutor-class-chat/components/ClassChatScreen";

export const metadata: Metadata = { title: "Tin nhắn lớp | BeeWise LMS" };
export default async function Page({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <ClassChatScreen key={classId} classId={classId} />;
}
