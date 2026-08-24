import type { Metadata } from "next";
import { TuitionFeeScreen } from "@/features/learner-tuition-fee/components/TuitionFeeScreen";

export const metadata: Metadata = {
  title: "Theo dõi học phí | BeeWise Learner",
  description: "Theo dõi học phí đã thanh toán theo lớp học.",
};

export default function LearnerTuitionFeePage() {
  return <TuitionFeeScreen />;
}
