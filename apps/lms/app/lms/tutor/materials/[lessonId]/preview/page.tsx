import { MaterialPreviewScreen } from "@/features/tutor-materials/components/MaterialPreviewScreen";
export const metadata = { title: "Preview & chỉnh sửa tài liệu | BeeWise Tutor" };
export default async function Page({ params, searchParams }: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ materialId?: string; from?: string | string[] }>;
}) {
  const [{ lessonId }, { materialId, from }] = await Promise.all([params, searchParams]);
  return <MaterialPreviewScreen key={materialId ?? lessonId} sessionId={lessonId} materialId={materialId} returnToAI={from === "ai-modal"} />;
}
