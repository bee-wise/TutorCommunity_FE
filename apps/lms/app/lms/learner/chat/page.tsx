import type { Metadata } from "next";
import { LearnerMessagesScreen } from "@/features/learner-messages/components/LearnerMessagesScreen";

export const metadata: Metadata = {
  title: "Tin nhắn với gia sư | BeeWise Learner",
  description: "Trao đổi với gia sư theo từng lớp học.",
};

export default function LearnerMessagesPage() {
  return <LearnerMessagesScreen />;
}
