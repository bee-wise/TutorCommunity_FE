import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { AIFeaturesSection } from "@/features/landing/components/AIFeaturesSection";
import { VideoIntroSection } from "@/features/landing/components/VideoIntroSection";
import { FeatureShowcaseSection } from "@/features/landing/components/FeatureShowcaseSection";
import { HowItWorksSection } from "@/features/landing/components/HowItWorksSection";
import { TutorSection } from "@/features/landing/components/TutorSection";
import { TutorCarouselSection } from "@/features/landing/components/TutorCarouselSection";
import { FeedbackSection } from "@/features/landing/components/FeedbackSection";
import { SponsorSection } from "@/features/landing/components/SponsorSection";
import { FaqSection } from "@/features/landing/components/FaqSection";

import { TutorGuideTrust } from "@/features/tutor-guide/components/TutorGuideTrust";

export const metadata: Metadata = {
  title: "Cộng Đồng Gia Sư - Tìm Gia Sư Phù Hợp Nhanh Chóng Với AI",
  description:
    "Chỉ mất khoảng 30 giây để tìm gia sư phù hợp cùng BeeWise. Hồ sơ được xác thực, kết nối trực tiếp với gia sư và cố vấn hỗ trợ xuyên suốt. Trải nghiệm miễn phí, không cần đăng nhập.",
  keywords: [
    "tìm gia sư AI",
    "gia sư uy tín",
    "BeeWise",
    "tìm gia sư online",
    "nền tảng kết nối gia sư",
  ],
  openGraph: {
    title: "BeeWise - Tìm Gia Sư Phù Hợp Nhanh Chóng Với AI",
    description:
      "Tìm gia sư phù hợp trong 30 giây với AI. Hồ sơ xác thực, cố vấn đồng hành, miễn phí.",
    type: "website",
    locale: "vi_VN",
    siteName: "BeeWise",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeeWise - Tìm Gia Sư Phù Hợp Nhanh Chóng Với AI",
    description:
      "Tìm gia sư phù hợp trong 30 giây với AI. Hồ sơ xác thực, cố vấn đồng hành, miễn phí.",
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <VideoIntroSection />
        <AIFeaturesSection />
        <FeatureShowcaseSection />
        <TutorGuideTrust />
        <HowItWorksSection />
        <TutorCarouselSection />
        <TutorSection />
        <FeedbackSection />
        <SponsorSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
