import type { Metadata } from "next";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { PainPointSection } from "@/src/features/landing/components/PainPointSection";
import { SolutionSection } from "@/src/features/landing/components/SolutionSection";
import { HowItWorksSection } from "@/src/features/landing/components/HowItWorksSection";
import { TutorSection } from "@/src/features/landing/components/TutorSection";
import { TutorCarouselSection } from "@/src/features/landing/components/TutorCarouselSection";
import { FaqSection } from "@/src/features/landing/components/FaqSection";

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
  robots: {
    index: true,
    follow: true,
  },
};

const NAV_LINKS = [
  { label: "Gia Sư", href: "/tutors" },
  { label: "Cách Hoạt Động", href: "#how-it-works" },
  { label: "Trở thành gia sư", href: "#for-tutors" },
];

export default function LandingPage() {
  return (
    <>
      <Header NAV_LINKS={NAV_LINKS} />
      <main id="main-content">
        <HeroSection />
        <PainPointSection />
        <SolutionSection />
        <HowItWorksSection />
        <TutorSection />
        <TutorCarouselSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
