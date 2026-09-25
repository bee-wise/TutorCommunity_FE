import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { ClassDiscovery } from "@/features/classes/components/ClassDiscovery";

export const metadata: Metadata = {
  title: "Tìm lớp học nhóm",
  description:
    "Khám phá lớp học nhóm nhỏ do gia sư BeeWise tổ chức. Tìm lớp theo môn học, lịch học, hình thức và học phí phù hợp.",
  alternates: { canonical: "/classes" },
};

export default function ClassesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <ClassDiscovery />
      </main>
      <Footer />
    </div>
  );
}
