import type { Metadata } from "next";
import { LmsHeader } from "@/features/portal/components/LmsHeader";
import { LmsHeroSection } from "@/features/portal/components/LmsHeroSection";
import { LmsIntroSection } from "@/features/portal/components/LmsIntroSection";
import { LmsFeaturesSection } from "@/features/portal/components/LmsFeaturesSection";
import { LmsBenefitsSection } from "@/features/portal/components/LmsBenefitsSection";
import { LmsHowItWorksSection } from "@/features/portal/components/LmsHowItWorksSection";
import { LmsFooter } from "@/features/portal/components/LmsFooter";

export const metadata: Metadata = {
  title: "BeeWise LMS - Nền tảng học tập thông minh",
  description:
    "BeeWise LMS kết nối gia sư và học viên thông minh. Học 1-1 với gia sư chất lượng, theo dõi tiến độ và đạt mục tiêu học tập hiệu quả.",
};

export default function LmsHomePage() {
  return (
    <main className="overflow-x-hidden">
      <LmsHeader />
      <LmsHeroSection />
      <LmsIntroSection />
      <LmsFeaturesSection />
      <LmsBenefitsSection />
      <LmsHowItWorksSection />
      <LmsFooter />
    </main>
  );
}
