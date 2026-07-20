import type { Metadata } from "next";
import { TutorApprovedRoute } from "@/features/tutor-approved";

export const metadata: Metadata = {
  title: "Tin nhắn | BeeWise",
  description: "Phòng chat 3 bên giữa Gia sư, Học viên và Consultant.",
};

export default function Page() {
  return <TutorApprovedRoute screen="messages" />;
}
