import type { Metadata } from "next";
import { LearnerMessagesRoute } from "@/features/messages";

export const metadata: Metadata = {
  title: "Phòng Chat | BeeWise",
  description: "Trò chuyện với Gia sư của bạn.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ chatRoomId: string }>;
}) {
  const { chatRoomId } = await params;
  return <LearnerMessagesRoute screen="chat-room" chatRoomId={chatRoomId} />;
}
