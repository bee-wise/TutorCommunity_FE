import type { Metadata } from "next";
import { TuitionClassDetailScreen } from "@/features/learner-tuition-fee/components/TuitionClassDetailScreen";

export const metadata: Metadata = {
  title: "Chi tiết học phí | BeeWise Learner",
  description: "Theo dõi phân bổ học phí theo từng buổi học.",
};

export default async function LearnerTuitionClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  return <TuitionClassDetailScreen classId={classId} />;
}
