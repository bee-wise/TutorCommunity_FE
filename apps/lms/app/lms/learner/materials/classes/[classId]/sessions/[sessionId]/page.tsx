import { SessionMaterialsScreen } from "@/features/learner-materials/components/SessionMaterialsScreen";

export default async function LearnerSessionMaterialsPage({
  params,
}: {
  params: Promise<{ classId: string; sessionId: string }>;
}) {
  const { classId, sessionId } = await params;
  return <SessionMaterialsScreen classId={classId} sessionId={sessionId} />;
}
