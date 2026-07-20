import type { Metadata } from "next";
import { TutorMessagesRoute } from "@/features/tutor-messages/components/TutorMessagesRoute";

export const metadata: Metadata = {
  title: "Chi tiết phòng chat | BeeWise",
  description: "Trò chuyện với học viên của bạn.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ chatRoomId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <TutorMessagesRoute
      screen="chat-room"
      chatRoomId={resolvedParams.chatRoomId}
    />
  );
}
