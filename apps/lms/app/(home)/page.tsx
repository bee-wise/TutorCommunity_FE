import type { Metadata } from "next";
import { LmsHeader } from "@/features/portal/components/LmsHeader";
import { LmsHeroSection } from "@/features/portal/components/LmsHeroSection";
import { DualRoleFeatureGrid } from "@/features/portal/components/DualRoleFeatureGrid";
import { ClassActivationShowcase } from "@/features/portal/components/ConsultantShowcase";
import { FaqAndCtaSection } from "@/features/portal/components/FaqAndCtaSection";

export const metadata: Metadata = {
  title: "BeeWise LMS — Hệ Thống Quản Lý Học Tập Thông Minh",
  description:
    "Không gian làm việc và học tập của Gia sư và Học viên. Số hóa lịch trình, lưu trữ tài liệu và tối ưu hóa hiệu quả dạy & học trên BeeWise LMS.",
};

export default function LmsHomePage() {
  return (
    <main className="overflow-x-hidden">
      <LmsHeader />
      <LmsHeroSection />
      <DualRoleFeatureGrid />
      <ClassActivationShowcase />
      <FaqAndCtaSection />
    </main>
  );
}
