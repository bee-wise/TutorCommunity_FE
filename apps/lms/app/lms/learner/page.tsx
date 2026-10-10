import type { Metadata } from "next";
import { LearnerReportScreen } from "@/features/learner-overview/components/LearnerReportScreen";

export const metadata: Metadata = { title: "Báo cáo học tập | BeeWise Learner" };

export default function LearnerOverviewPage() {
  return <LearnerReportScreen />;
}
