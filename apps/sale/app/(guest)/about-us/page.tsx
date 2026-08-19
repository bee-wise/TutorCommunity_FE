import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { AboutHero } from "@/features/about/components/AboutHero";
import { AboutMission } from "@/features/about/components/AboutMission";
import { AboutTeam } from "@/features/about/components/AboutTeam";
import { AboutCta } from "@/features/about/components/AboutCta";
import { SponsorSection } from "@/features/landing/components/SponsorSection";

export const metadata: Metadata = {
  title: "Về Chúng Tôi | BeeWise - Nền Tảng Kết Nối Gia Sư",
  description:
    "Tìm hiểu về BeeWise — đội ngũ sáng lập, sứ mệnh và giá trị cốt lõi của nền tảng kết nối gia sư và học viên thông minh nhất Việt Nam.",
  keywords: [
    "về BeeWise",
    "đội ngũ BeeWise",
    "sứ mệnh BeeWise",
    "nền tảng gia sư",
    "startup giáo dục",
    "FPT University",
  ],
  openGraph: {
    title: "Về Chúng Tôi | BeeWise",
    description:
      "Tìm hiểu về BeeWise — sứ mệnh kết nối gia sư và học viên minh bạch, chất lượng.",
    type: "website",
    locale: "vi_VN",
    siteName: "BeeWise",
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main id="main-content">
        <AboutHero />
        <AboutMission />
        <AboutTeam />
        <SponsorSection />
        <AboutCta />
      </main>

      <Footer />
    </div>
  );
}
