import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from '@workspace/ui/components/layout/Header';
import { Footer } from '@workspace/ui/components/layout/Footer';
import { TutorListController } from '@workspace/core/features/tutor-list/components/TutorListController';

export const metadata: Metadata = {
  title: "Tìm Gia Sư | BeeWise – Kết Nối Gia Sư Qua Công Nghệ AI",
  description:
    "Tìm gia sư phù hợp nhanh chóng với BeeWise. Tìm kiếm thủ công theo môn học, học phí, khu vực — hoặc mô tả nhu cầu bằng tiếng Việt để AI tìm gia sư tốt nhất cho bạn.",
  keywords: [
    "tìm gia sư",
    "gia sư online",
    "gia sư toán",
    "gia sư tiếng anh",
    "gia sư tại nhà",
    "luyện thi gia sư",
    "BeeWise",
    "tìm gia sư AI",
  ],
};

export default function TutorListPage() {
  // isLoggedIn: false for guest users — pass auth state here from session/cookie in production
  const isLoggedIn = false;

  return (
    <div className="flex flex-col min-h-full">
      <main id="main-content">
        <Suspense
          fallback={<div className="min-h-[calc(100dvh-64px)] bg-[#f8f9fc]" />}
        >
          <TutorListController isLoggedIn={isLoggedIn} />
        </Suspense>
      </main>
    </div>
  );
}
