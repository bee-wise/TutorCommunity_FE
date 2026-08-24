import type { Metadata } from "next";
import { EarningsDashboard } from "@/features/tutor-earnings/components/EarningsDashboard";

export const metadata: Metadata = {
  title: "Thu nhập & Thanh toán | BeeWise LMS",
  description: "Theo dõi thu nhập và trạng thái quyết toán dành cho gia sư BeeWise.",
};

export default function TutorEarningsPage() {
  return <EarningsDashboard />;
}

