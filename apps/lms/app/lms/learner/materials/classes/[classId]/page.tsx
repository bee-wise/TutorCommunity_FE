import { ClassSessionsScreen } from "@/features/learner-materials/components/ClassSessionsScreen";

export default async function LearnerClassMaterialsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  return <ClassSessionsScreen classId={classId} />;
}
