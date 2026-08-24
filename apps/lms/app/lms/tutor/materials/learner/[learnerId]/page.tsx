import type { Metadata } from "next";
import { LearnerMaterialsScreen } from "@/features/tutor-materials/components/LearnerMaterialsScreen";

export const metadata: Metadata = {
  title: "Thư viện học viên | BeeWise Tutor",
};

interface PageProps {
  params: Promise<{ learnerId: string }>;
}

export default async function LearnerMaterialsPage({ params }: PageProps) {
  const { learnerId } = await params;
  return <LearnerMaterialsScreen learnerId={learnerId} />;
}

