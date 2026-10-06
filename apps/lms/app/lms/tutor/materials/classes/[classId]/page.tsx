import { ClassMaterialsWorkspace } from "@/features/tutor-materials/components/ClassMaterialsWorkspace";

export const metadata = { title: "Tài liệu lớp học | BeeWise Tutor" };
export default async function Page({ params, searchParams }: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ ai?: string; session?: string }>;
}) {
  const [{ classId }, { ai, session }] = await Promise.all([params, searchParams]);
  return <ClassMaterialsWorkspace key={classId} classId={classId} initialMaterialId={ai} initialSessionId={session} />;
}
