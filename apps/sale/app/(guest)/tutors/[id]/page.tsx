import type { Metadata } from "next";
import { Footer } from '@workspace/ui/components/layout/Footer';
import { Header } from '@workspace/ui/components/layout/Header';
import { TutorProfilePage } from '@workspace/core/features/tutor-profile/components/TutorProfilePage';

export const metadata: Metadata = {
  title: "Hồ sơ gia sư | BeeWise",
  description:
    "Hồ sơ gia sư BeeWise với phong cách giảng dạy, học vấn, minh chứng đã duyệt và phản hồi thân thiện với phụ huynh.",
};

const NAV_LINKS = [
  { label: "Gia sư", href: "/tutors" },
  { label: "Đăng ký làm gia sư", href: "/tutor-guide" },
];

export default function TutorProfileRoutePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header NAV_LINKS={NAV_LINKS} isTutorPage={false} />
      <main id="main-content" className="flex-1 pt-16">
        <TutorProfilePage />
      </main>
      <Footer />
    </div>
  );
}
