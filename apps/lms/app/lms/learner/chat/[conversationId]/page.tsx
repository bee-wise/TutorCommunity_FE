import type { Metadata } from "next";
import { LearnerMessagesScreen } from "@/features/learner-messages/components/LearnerMessagesScreen";

export const metadata: Metadata = {
  title: "Cuộc trò chuyện | BeeWise Learner",
  description: "Trao đổi với gia sư theo lớp học.",
};

export default async function LearnerConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <LearnerMessagesScreen conversationId={conversationId} />;
}
