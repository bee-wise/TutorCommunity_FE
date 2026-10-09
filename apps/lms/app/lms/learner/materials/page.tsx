import { ClassLibraryScreen } from "@/features/learner-materials/components/ClassLibraryScreen";

export const metadata = {
  title: "Kho tài liệu | BeeWise Learner",
};

export default async function LearnerMaterialsPage({ searchParams }: { searchParams: Promise<{ kind?: string | string[] }> }) {
  const { kind } = await searchParams;
  return <ClassLibraryScreen initialKind={Array.isArray(kind) ? kind[0] : kind} />;
}
