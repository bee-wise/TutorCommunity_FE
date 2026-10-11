import type { Metadata } from "next";
import { LmsPortal } from "@/features/portal/components/LmsPortal";

export const metadata: Metadata = {
  title: "BeeWise LMS | Hệ Thống Quản Lý Học Tập Thông Minh",
  description:
    "Không gian làm việc và học tập của Gia sư và Học viên. Số hóa lịch trình, lưu trữ tài liệu và tối ưu hóa hiệu quả dạy & học trên BeeWise LMS.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function LmsHomePage() {
  return <LmsPortal />;
}
