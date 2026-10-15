import type { Metadata } from "next";
import { LearnerClassChatDirectory } from "@/features/learner-messages/components/LearnerClassChatDirectory";

export const metadata: Metadata = {
  title: "Tin nhắn với gia sư | BeeWise Learner",
  description: "Trao đổi với gia sư theo từng lớp học.",
};

export default function LearnerMessagesPage() {
  return <LearnerClassChatDirectory />;
}
