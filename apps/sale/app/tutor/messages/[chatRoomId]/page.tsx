import type { Metadata } from "next";
import { TutorApprovedRoute } from "@/features/tutor-approved";

export const metadata: Metadata = {
  title: "Chat Room | BeeWise",
  description: "Phòng chat 3 bên giữa Gia sư, Học viên và Consultant.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ chatRoomId: string }>;
}) {
  const { chatRoomId } = await params;
  return <TutorApprovedRoute screen="chat-room" chatRoomId={chatRoomId} />;
}
