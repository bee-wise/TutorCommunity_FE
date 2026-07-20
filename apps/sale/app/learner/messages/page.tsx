import type { Metadata } from "next";
import { LearnerMessagesRoute } from "@/features/messages";

export const metadata: Metadata = {
  title: "Tin nhắn của tôi | BeeWise",
  description: "Trò chuyện với Gia sư của bạn.",
};

export default function Page() {
  return <LearnerMessagesRoute screen="messages" />;
}
