import type { Metadata } from "next";
import { Footer } from '@workspace/ui/components/layout/Footer';
import { TutorProfilePage } from '@/features/tutor-profile/components/TutorProfilePage';

export const metadata: Metadata = {
  title: "Hồ sơ gia sư | BeeWise",
  description:
    "Hồ sơ gia sư BeeWise với phong cách giảng dạy, học vấn, minh chứng đã duyệt và phản hồi thân thiện với phụ huynh.",
};

export default function TutorProfileRoutePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main-content" className="flex-1">
        <TutorProfilePage />
      </main>
      <Footer />
    </div>
  );
}

