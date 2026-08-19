import type { Metadata } from "next";
import { Header } from "@workspace/ui/components/layout/Header";
import { Footer } from "@workspace/ui/components/layout/Footer";
import { TutorGuideHero } from "@/features/tutor-guide/components/TutorGuideHero";
import { TutorGuidePainPoints } from "@/features/tutor-guide/components/TutorGuidePainPoints";
import { TutorGuideFeatures } from "@/features/tutor-guide/components/TutorGuideFeatures";
import { TutorGuideSteps } from "@/features/tutor-guide/components/TutorGuideSteps";
import { TutorGuideFaq } from "@/features/tutor-guide/components/TutorGuideFaq";
import { TutorGuideCta } from "@/features/tutor-guide/components/TutorGuideCta";
import { TutorGuideFeedback } from "@/features/tutor-guide/components/TutorGuideFeedback";

export const metadata: Metadata = {
  title: "Trở Thành Gia Sư BeeWise | Hồ Sơ Xác Thực, Kết Nối Minh Bạch",
  description:
    "Tạo hồ sơ gia sư BeeWise miễn phí, xác thực năng lực và kết nối với học viên phù hợp. Cơ chế thu nhập rõ ràng, có đội ngũ hỗ trợ đồng hành.",
  keywords: [
    "đăng ký làm gia sư",
    "tìm việc gia sư",
    "gia sư online",
    "gia sư tại nhà",
    "việc làm gia sư",
    "gia sư sinh viên",
    "nền tảng gia sư",
    "BeeWise",
  ],
};

export default function TutorGuidePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main id="main-content">
        <TutorGuideHero />

        <TutorGuideSteps />

        <TutorGuidePainPoints />

        <TutorGuideFeatures />

        <TutorGuideFeedback />

        <TutorGuideCta />

        <TutorGuideFaq />
      </main>

      <Footer />
    </div>
  );
}
