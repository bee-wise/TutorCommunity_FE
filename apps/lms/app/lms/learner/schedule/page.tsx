import type { Metadata } from "next";
import { LearnerScheduleScreen } from "@/features/learner-schedule/components/LearnerScheduleScreen";

export const metadata: Metadata = {
  title: "Lịch học của tôi | BeeWise LMS",
  description: "Theo dõi lịch học và các buổi học sắp tới trên BeeWise LMS.",
};

export default function LearnerSchedulePage() {
  return <LearnerScheduleScreen />;
}

