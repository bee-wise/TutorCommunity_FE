import { TutorMaterialsScreen } from "@/features/tutor-materials/components/TutorMaterialsScreen";
import { CLASS_LEARNERS } from "@/features/tutor-materials/data/classroom.mock";
export const metadata = { title: "Quản lý tài liệu | BeeWise Tutor" };
export default async function Page({ searchParams }: { searchParams: Promise<{ learner?: string }> }) {
  const { learner } = await searchParams;
  const initialSearch = CLASS_LEARNERS.find((item) => item.id === learner)?.fullName ?? "";
  return <TutorMaterialsScreen initialSearch={initialSearch} />;
}
