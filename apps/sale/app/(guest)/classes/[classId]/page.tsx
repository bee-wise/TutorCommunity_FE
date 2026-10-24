import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { ClassDetailScreen } from "@/features/classes/components/ClassDetailScreen";

export const metadata: Metadata = {
  title: "Chi tiết lớp học nhóm",
  description:
    "Xem thông tin, học phí, lịch khai giảng và lộ trình học của lớp nhóm nhỏ do gia sư BeeWise tổ chức.",
};

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <ClassDetailScreen key={classId} classId={classId} />
      </main>
      <Footer />
    </div>
  );
}
