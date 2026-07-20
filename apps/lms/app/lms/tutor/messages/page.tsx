import type { Metadata } from "next";
import { TutorMessagesRoute } from "@/features/tutor-messages/components/TutorMessagesRoute";

export const metadata: Metadata = {
  title: "Tin nhắn | BeeWise",
  description: "Trò chuyện với học viên của bạn.",
};

export default function Page() {
  return <TutorMessagesRoute screen="messages" />;
}
