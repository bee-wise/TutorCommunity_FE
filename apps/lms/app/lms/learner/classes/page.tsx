import type { Metadata } from "next";
import { LearnerClassesScreen } from "@/features/learner-classes/components/LearnerClassesScreen";

export const metadata: Metadata = { title: "Lớp học | BeeWise Learner" };

export default async function LearnerClassesPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  return <LearnerClassesScreen initialKind={kind} />;
}
