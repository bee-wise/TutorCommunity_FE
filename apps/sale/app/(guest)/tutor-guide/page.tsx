import type { Metadata } from "next";
import { Header } from '@workspace/ui/components/layout/Header';
import { Footer } from '@workspace/ui/components/layout/Footer';
import { TutorGuideHero } from '@/features/tutor-guide/components/TutorGuideHero';
import { TutorGuidePainPoints } from '@/features/tutor-guide/components/TutorGuidePainPoints';
import { TutorGuideFeatures } from '@/features/tutor-guide/components/TutorGuideFeatures';
import { TutorGuideSteps } from '@/features/tutor-guide/components/TutorGuideSteps';
import { TutorGuideFaq } from '@/features/tutor-guide/components/TutorGuideFaq';
import { TutorGuideCta } from '@/features/tutor-guide/components/TutorGuideCta';

export const metadata: Metadata = {
  title:
    "Đăng Ký Làm Gia Sư BeeWise | Không Phí Nhận Lớp, Kết Nối Học Viên Nhanh",
  description:
    "Đăng ký làm gia sư BeeWise miễn phí. Không mất phí nhận lớp, kết nối học viên bằng công nghệ AI, quản lý lớp học thông minh, thanh toán minh bạch và có đội ngũ hỗ trợ đồng hành.",
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
    <div className="flex flex-col min-h-full">
      <Header />

      <main id="main-content">
        <TutorGuideHero />

        <TutorGuidePainPoints />

        <TutorGuideFeatures />

        <TutorGuideSteps />

        <TutorGuideFaq />
        <TutorGuideCta />
      </main>

      <Footer />
    </div>
  );
}

